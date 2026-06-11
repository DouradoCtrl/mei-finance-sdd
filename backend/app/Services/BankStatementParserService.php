<?php

namespace App\Services;

class BankStatementParserService
{
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
     * Auxiliar para pegar o valor de uma tag OFX.
     */
    private function getTagValue(string $tag, string $block): string
    {
        if (preg_match('/<' . $tag . '>([^<\r\n]+)/i', $block, $match)) {
            return trim($match[1]);
        }
        return '';
    }
}
