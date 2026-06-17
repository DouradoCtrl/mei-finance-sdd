<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return (new class {
                    use \App\Traits\ApiResponse;
                    public function respond($e) {
                        return $this->errorResponse('Os dados fornecidos são inválidos.', 422, $e->errors());
                    }
                })->respond($e);
            }
        });

        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return (new class {
                    use \App\Traits\ApiResponse;
                    public function respond() {
                        return $this->errorResponse('Usuário não autenticado.', 401);
                    }
                })->respond();
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return (new class {
                    use \App\Traits\ApiResponse;
                    public function respond() {
                        return $this->errorResponse('Esta ação não é autorizada.', 403);
                    }
                })->respond();
            }
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                $modelName = class_basename($e->getModel());
                $translated = match ($modelName) {
                    'User' => 'Usuário',
                    default => $modelName,
                };
                return (new class {
                    use \App\Traits\ApiResponse;
                    public function respond($translated) {
                        return $this->errorResponse("{$translated} não encontrado.", 404);
                    }
                })->respond($translated);
            }
        });
    })->create();
