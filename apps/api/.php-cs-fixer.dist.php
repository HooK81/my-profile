<?php

declare(strict_types=1);

$finder = PhpCsFixer\Finder::create()
    ->exclude('tests/Fixtures')
    ->exclude(__DIR__.'/src/Migrations')
    ->in(__DIR__.'/src')
    ->in(__DIR__.'/tests')
;

$config = new PhpCsFixer\Config();
$config
    ->setRiskyAllowed(true)
    ->setRules([
        '@PSR12' => true,
        '@Symfony' => true,
        '@DoctrineAnnotation' => true,
        'full_opening_tag' => true,
        'blank_line_after_namespace' => true,
        'phpdoc_to_comment' => false,
        'phpdoc_summary' => false,
        'no_unneeded_final_method' => false,
        'no_extra_blank_lines' => false,
        'single_line_throw' => false,
        'no_superfluous_phpdoc_tags' => true,
        'concat_space' => ['spacing' => 'one'],
        'multiline_whitespace_before_semicolons' => ['strategy' => 'new_line_for_chained_calls'],
        'phpdoc_to_comment' => false,
        'native_constant_invocation' => true,
        'native_function_invocation' => ['include' => ['@compiler_optimized']],
        'array_syntax' => ['syntax' => 'short'],
        'list_syntax' => ['syntax' => 'short'],
    ])
    ->setFinder($finder)
    ->setCacheFile(__DIR__.'/var/cache/dev/.php_cs.cache')
;

return $config;
