import { Typography } from 'Components/Typography/Typography';
import './Article.scss';

export interface ArticleProps {
  primary?: boolean;
  size?: 'form_small' | 'form_medium' | 'form_large';
  category?: string;
  title?: string;
  byline?: string;
  content?: string;
  articleClass?: string;
  headerImageSrc?: string;
  type?: 'submit' | 'Article';
  children?: any;
  publicationDate?: string;
}

export const Article = function ({
  articleClass = '',
  children,
  title = 'title',
  category = '',
  content = '',
  byline = '',
  publicationDate = '',
  ...props
}: ArticleProps) {

  return (
    <div className={['custom-article', articleClass].join(' ')}>
      {props.headerImageSrc ? <img className="article-image" alt={title} src={props.headerImageSrc} /> : ''}
      <div className="article-content">
        <Typography usage='headingMedium' typeClass={['mb-4']} content={title} />
        {byline && <Typography usage='body' typeClass={['mb-2 opacity-50']} content={byline} />}
        <Typography usage='body' typeClass={['mb-2 opacity-50']} content={`Pillar: ${category}`} />
        {/* <Typography usage='body' typeClass={['mb-6 opacity-50']} content={publicationDate} /> */}

        {children ?
          <Typography usage='body' typeClass={['mb-8']}>
            {children}
          </Typography> : (
            <Typography usage='body' typeClass={['mb-8']} content={content} />
          )}
      </div>
    </div>
  );
};
