import Game from '@/_components/Game';
import { Suspense } from 'react';

export default function Snake() {
  return (
    <Suspense fallback={<div>Snaking...</div>}>
      <Game />
    </Suspense>
  );
}
