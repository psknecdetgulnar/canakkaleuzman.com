// JSON-LD <script> içeriğini güvenle basar. JSON.stringify "</" dizisini
// kaçırmaz; kullanıcı girdisi (şirket adı, blog başlığı vb.) "</script>"
// içeriyorsa doğrudan JSON.stringify ile basmak script bağlamından kaçışa
// (XSS) izin verebilir. "<" karakterini unicode kaçışla güvene alır.
export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
