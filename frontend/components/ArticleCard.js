import Link from 'next/link';
import Image from 'next/image';

export default function ArticleCard({ article }) {
  const {
    title,
    slug,
    image,
    summary,
    category,
    published_date
  } = article;

  const formattedDate = published_date ? new Date(published_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <div className="card h-full flex flex-col">
      <div className="relative aspect-[16/9] w-full">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {category && (
          <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 m-2 rounded">
            {typeof category === 'string' ? category : category.name}
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold line-clamp-2 mb-2">
          <Link href={`/articles/${slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-neutral-600 text-sm line-clamp-3 mb-3">
          {summary}
        </p>
        {formattedDate && (
          <div className="mt-auto">
            <span className="text-neutral-500 text-xs">{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
