import Link from 'next/link';
import Image from 'next/image';

export default function FeaturedArticle({ article }) {
  const {
    title,
    slug,
    image,
    summary,
    published_date,
    author
  } = article;

  const formattedDate = published_date ? new Date(published_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 items-stretch bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
      <div className="relative h-[250px] md:h-[400px] w-full">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-neutral-800 hover:text-primary transition-colors">
          <Link href={`/articles/${slug}`}>
            {title}
          </Link>
        </h2>
        {author && (
          <div className="mb-2 text-neutral-600 text-sm">
            By {author.name}{author.credentials ? `, ${author.credentials}` : ''}
          </div>
        )}
        {formattedDate && (
          <div className="mb-3 text-neutral-500 text-xs">
            {formattedDate}
          </div>
        )}
        <p className="text-neutral-600 mb-4 line-clamp-3">
          {summary}
        </p>
        <Link 
          href={`/articles/${slug}`}
          className="inline-flex items-center text-primary font-medium hover:text-primary-dark"
        >
          Read more
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}