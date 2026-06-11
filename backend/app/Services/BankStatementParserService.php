<?php

namespace App\Services;

class BankStatementParserService
{
    /**
     * Mapeamento de meses abreviados em português/inglês para números.
     */
    private const MONTHS_MAP = [
        'jan' => '01', 'feb' => '02', 'fev' => '02', 'mar' => '03', 'apr' => '04', 'abr' => '04',
        'may' => '05', 'mai' => '05', 'jun' => '06', 'jul' => '07', 'aug' => '08', 'ago' => '08',
        'sep' => '09', 'set' => '09', 'oct' => '10', 'out' => '10', 'nov' => '11', 'dec' => '12',
        'dez' => '12'
    ];

    /**
     * Processa um arquivo OFX bruto.
     *
     * @param string $content
     * @param string $source
     * @return array
     */
    public function parseOfx(string $content, string $source): array
    {
        $transactions = [];

        // Encontra todos os blocos <STMTTRN>...</STMTTRN>
        preg_match_all('/<STMTTRN>(.*?)<\/STMTTRN>/is', $content, $matches);

        foreach ($matches[1] as $block) {
            $dateStr = $this->getTagValue('DTPOSTED', $block);
            $amountStr = $this->getTagValue('TRNAMT', $block);
            $fitId = $this->getTagValue('FITID', $block);
            $memo = $this->getTagValue('MEMO', $block);
            $name = $this->getTagValue('NAME', $block);

            $description = $memo ?: ($name ?: 'Transação Sem Descrição');

            // Formata data: AAAAMMDD -> YYYY-MM-DD
            $date = date('Y-m-d');
            if (preg_match('/^(\d{4})(\d{2})(\d{2})/', $dateStr, $dateMatches)) {
                $date = "{$dateMatches[1]}-{$dateMatches[2]}-{$dateMatches[3]}";
            }

            // Formata o valor
            $amount = floatval($amountStr);

            $transactions[] = [
                'transaction_date' => $date,
                'description' => html_entity_decode(trim($description), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                'amount' => $amount,
                'source' => $source,
                'classification' => 'pending',
                'fit_id' => $fitId,
                'is_duplicate' => false,
            ];
        }

        return $transactions;
    }

    /**
     * Processa texto bruto colado (TXT).
     *
     * @param string $rawText
     * @param string $source
     * @return array
     */
    public function parseText(string $rawText, string $source): array
    {
        $transactions = [];
        $lines = array_filter(array_map('trim', explode("\n", $rawText)));

        $currentTransaction = null;

        foreach ($lines as $line) {
            if (empty($line)) {
                continue;
            }

            // 1. Tentar ler como linha única: se a linha tem data E valor
            $singleLineData = $this->parseSingleLine($line);
            if ($singleLineData) {
                // Se já tínhamos uma transação em andamento na lógica multilinha, salvamos
                if ($currentTransaction) {
                    $transactions[] = $this->finalizeTextTransaction($currentTransaction, $source);
                    $currentTransaction = null;
                }

                $transactions[] = [
                    'transaction_date' => $singleLineData['date'],
                    'description' => $singleLineData['description'],
                    'amount' => $singleLineData['amount'],
                    'source' => $source,
                    'classification' => 'pending',
                    'fit_id' => null,
                    'is_duplicate' => false,
                ];
                continue;
            }

            // 2. Lógica Multilinha: se a linha for apenas uma data
            $date = $this->matchDate($line);
            if ($date) {
                if ($currentTransaction) {
                    $transactions[] = $this->finalizeTextTransaction($currentTransaction, $source);
                }
                $currentTransaction = [
                    'date' => $date,
                    'description' => '',
                    'amount' => null,
                ];
                continue;
            }

            // Se for apenas um valor monetário
            $amount = $this->matchAmount($line);
            if ($amount !== null && $currentTransaction) {
                $currentTransaction['amount'] = $amount;
                $transactions[] = $this->finalizeTextTransaction($currentTransaction, $source);
                $currentTransaction = null;
                continue;
            }

            // Se for descrição (caso estejamos construindo uma transação multilinha)
            if ($currentTransaction) {
                $currentTransaction['description'] = trim($currentTransaction['description'] . ' ' . $line);
            }
        }

        // Finaliza última transação se sobrou em aberto
        if ($currentTransaction) {
            $transactions[] = $this->finalizeTextTransaction($currentTransaction, $source);
        }

        return $transactions;
    }

    /**
     * Auxiliar para pegar o valor de uma tag OFX.
     */
    private function getTagValue(string $tag, string $block): string
    {
        if (preg_match('/<' . $tag . '>([^<\r\n]+)/i', $block, $match)) {
            return trim($match[1]);
        }
        return '';
    }

    /**
     * Valida se a linha inteira possui data e valor (caso de linha única).
     */
    private function parseSingleLine(string $line): ?array
    {
        // Encontra a data na linha
        $date = $this->searchDateInString($line);
        if (!$date) {
            return null;
        }

        // Encontra o valor monetário na linha
        $amount = $this->searchAmountInString($line);
        if ($amount === null) {
            return null;
        }

        // Extrai a descrição (removendo a data e o valor da linha)
        $description = $line;
        // Remove a data original encontrada
        if (preg_match('/(\d{2}\/\d{2}\/\d{4}|\d{2}\/\d{2}\/\d{2}|\d{2}\/\d{2}|\d{2}\s+[a-zA-Z]{3})/i', $description, $matches)) {
            $description = str_replace($matches[0], '', $description);
        }

        // Remove o valor monetário original encontrado
        // Busca o trecho que contém o número formatado
        if (preg_match('/-?\s*(?:R\$)?\s*-?\s*\d+(?:\.\d{3})*,\d{2}/i', $description, $matches)) {
            $description = str_replace($matches[0], '', $description);
        } elseif (preg_match('/-?\s*\d+\.\d{2}/', $description, $matches)) {
            $description = str_replace($matches[0], '', $description);
        }

        $description = trim(preg_replace('/\s+/', ' ', $description));
        if (empty($description)) {
            $description = 'Transação Sem Descrição';
        }

        return [
            'date' => $date,
            'amount' => $amount,
            'description' => $description,
        ];
    }

    /**
     * Verifica se a string exata corresponde a uma data.
     */
    private function matchDate(string $str): ?string
    {
        return $this->searchDateInString($str, true);
    }

    /**
     * Procura uma data dentro da string.
     */
    private function searchDateInString(string $str, bool $exact = false)
    {
        $pattern = $exact 
            ? '/^(\d{2})\/(\d{2})\/(\d{4})$/' 
            : '/(\d{2})\/(\d{2})\/(\d{4})/';
        if (preg_match($pattern, $str, $matches)) {
            return "{$matches[3]}-{$matches[2]}-{$matches[1]}";
        }

        $pattern = $exact 
            ? '/^(\d{2})\/(\d{2})\/(\d{2})$/' 
            : '/(\d{2})\/(\d{2})\/(\d{2})/';
        if (preg_match($pattern, $str, $matches)) {
            return "20{$matches[3]}-{$matches[2]}-{$matches[1]}";
        }

        $pattern = $exact 
            ? '/^(\d{2})\/(\d{2})$/' 
            : '/(\d{2})\/(\d{2})/';
        if (preg_match($pattern, $str, $matches)) {
            $year = date('Y');
            return "{$year}-{$matches[2]}-{$matches[1]}";
        }

        $pattern = $exact 
            ? '/^(\d{2})\s+([a-zA-Z]{3})[a-z]*$/i' 
            : '/(\d{2})\s+([a-zA-Z]{3})[a-z]*/i';
        if (preg_match($pattern, $str, $matches)) {
            $day = $matches[1];
            $monthName = strtolower($matches[2]);
            $month = self::MONTHS_MAP[$monthName] ?? '01';
            $year = date('Y');
            return "{$year}-{$month}-{$day}";
        }

        return null;
    }

    /**
     * Verifica se a string exata é um valor monetário.
     */
    private function matchAmount(string $str): ?float
    {
        // Padrão rígido de valor exato da linha
        if (preg_match('/^-?\s*(?:R\$)?\s*-?\s*\d+(?:\.\d{3})*,\d{2}$/i', $str)) {
            return $this->cleanAmount($str);
        }
        return null;
    }

    /**
     * Procura um valor monetário em qualquer lugar da string.
     */
    private function searchAmountInString(string $str): ?float
    {
        if (preg_match('/(-?\s*(?:R\$)?\s*-?\s*\d+(?:\.\d{3})*,\d{2})/i', $str, $matches)) {
            return $this->cleanAmount($matches[1]);
        }
        if (preg_match('/(-?\s*\d+\.\d{2})/', $str, $matches)) {
            return floatval($matches[1]);
        }
        return null;
    }

    /**
     * Limpa e formata strings de valor brasileiras para float.
     */
    private function cleanAmount(string $str): float
    {
        $isNegative = str_contains($str, '-');

        // Remove tudo exceto números, vírgula e ponto
        $clean = preg_replace('/[^0-9,.]/', '', $str);

        // Se tiver ponto e vírgula (formato brasileiro padrão: 1.500,00)
        if (str_contains($clean, '.') && str_contains($clean, ',')) {
            $clean = str_replace('.', '', $clean);
            $clean = str_replace(',', '.', $clean);
        } else {
            // Se só tiver vírgula (ex: 150,00)
            $clean = str_replace(',', '.', $clean);
        }

        $value = floatval($clean);
        return $isNegative ? -$value : $value;
    }

    /**
     * Finaliza a construção de uma transação multilinha.
     */
    private function finalizeTextTransaction(array $tempTx, string $source): array
    {
        $desc = trim($tempTx['description']);
        if (empty($desc)) {
            $desc = 'Transação Sem Descrição';
        }

        return [
            'transaction_date' => $tempTx['date'],
            'description' => $desc,
            'amount' => $tempTx['amount'] ?? 0.0,
            'source' => $source,
            'classification' => 'pending',
            'fit_id' => null,
            'is_duplicate' => false,
        ];
    }
}
