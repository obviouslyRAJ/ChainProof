import { NextRequest, NextResponse } from 'next/server';
import { generateSHA256 } from '@/lib/hashing';
import pinataSDK from '@pinata/sdk';

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const hash = generateSHA256(buffer);

        // Metadata to store on IPFS
        const metadata = {
            name: file.name,
            hash: hash,
            timestamp: new Date().toISOString(),
            issuer: 'ChainProof Lite Admin',
        };

        const result = await pinata.pinJSONToIPFS(metadata);

        return NextResponse.json({
            success: true,
            hash: hash,
            ipfsHash: result.IpfsHash,
            metadata: metadata,
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('IPFS Upload Error:', err);
        return NextResponse.json({ error: 'Failed to process certificate' }, { status: 500 });
    }
}
