{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.pnpm
    pkgs.postgresql_16
  ];
}
