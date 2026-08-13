import { PhotoboothProvider } from './PhotoboothContext';

export default function PhotoboothLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhotoboothProvider>
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        {children}
      </div>
    </PhotoboothProvider>
  );
}
