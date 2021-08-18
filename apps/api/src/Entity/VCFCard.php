<?php

declare(strict_types=1);

namespace App\Entity;

/**
 * VCF Card Entity.
 *
 * @see VCardGenerator
 *
 * @author Julien CROCHET <julien@crochet.me>
 */
class VCFCard
{
    protected string $filename;
    protected string $VCFStream;

    public function __construct(string $filename, string $VCFStream)
    {
        $this->filename = $filename;
        $this->VCFStream = $VCFStream;
    }

    /**
     * Get the value of filename.
     */
    public function getFilename(): string
    {
        return $this->filename;
    }

    /**
     * Get the value of VCFStream.
     */
    public function getVCFStream(): string
    {
        return $this->VCFStream;
    }
}
