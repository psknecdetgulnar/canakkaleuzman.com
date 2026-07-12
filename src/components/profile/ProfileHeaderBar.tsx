import { SiteHeader } from "@/components/layout/SiteHeader";

// Diğer tüm sayfalarda kullanılan üst bar — artık anasayfayla birebir
// aynı SiteHeader bileşeni (Uzman Ol/Giriş Yap burada /panel'e bağlanır).
export function ProfileHeaderBar() {
  return <SiteHeader />;
}
