// Design.md §9: hairline üstü, tek satır.
export function Footer() {
  return (
    <footer className="border-t border-hairline mt-20">
      <div className="mx-auto max-w-measure px-gutter h-16 flex items-center justify-between text-sm text-muted">
        <span>Çanakkaleuzman.com — Çanakkale uzman dizini</span>
        <span className="tnum">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
