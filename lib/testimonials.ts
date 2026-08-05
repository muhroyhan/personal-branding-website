export type Testimonial = {
  name: string;
  role: string;
  company?: string;
  quoteEn: string;
  /** Falls back to `quoteEn` when omitted — a testimonial is someone else's
   * words, not prose this site rewrites per locale the way the rest of the
   * copy is. Only add this if the person actually said it in Indonesian. */
  quoteId?: string;
};

/**
 * Empty by default — `components/sections/testimonials.tsx` renders nothing
 * until at least one entry exists here. Add real testimonials as they're
 * collected; each one appears automatically on both `/` and `/id`, no other
 * code change needed.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
  company: 'Morning Glory Enterprise',
  name: 'Dyah Parama Iswari',
  quoteEn: 'I loved to be able to work with Royhan, he is a talented, responsible, dedicated, and highly skilled Software Engineer. He has the ability to handle complex technical challenges and always strives to deliver the best solutions. In addition, he has excellent communication skills and can collaborate effectively with the team. I highly recommend him for software development projects.',
  quoteId: 'Saya senang sempat bekerja sama dengan Royhan, dia adalah seorang Software Engineer yang berbakat, bertanggung jawab, berdedikasi, dan sangat terampil. Dia memiliki kemampuan untuk menangani tantangan teknis yang kompleks dan selalu berusaha memberikan solusi terbaik. Selain itu, dia memiliki keterampilan komunikasi yang sangat baik dan dapat bekerja sama secara efektif dengan tim. Saya sangat merekomendasikan dia untuk proyek pengembangan perangkat lunak.',
  role: 'Project Manager',
}
];
