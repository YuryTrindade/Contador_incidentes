import { NextResponse } from 'next/server';
import { readContadorData, resetContador } from '@/lib/services/contadorService';

export async function GET() {
  try {
    const data = await readContadorData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const data = await resetContador();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}