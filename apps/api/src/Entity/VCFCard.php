<?php

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
    protected $filename;
    protected $VCFStream;

    public function __construct($filename, $VCFStream)
    {
        $this->filename = $filename;
        $this->VCFStream = $VCFStream;
    }

    /**
     * Get the value of filename.
     */
    public function getFilename()
    {
        return $this->filename;
    }

    /**
     * Get the value of VCFStream.
     */
    public function getVCFStream()
    {
        return $this->VCFStream;
    }
}
