import styles from './Avatar.module.scss';

interface AvatarProps {
   name: string;
   size?: 'sm' | 'md' | 'lg';
   className?: string;
}

const Avatar = ({ name, size = 'md', className = '' }: AvatarProps) => {
   const initials = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toLocaleUpperCase('ru-RU');

   return (
      <div
         className={`${styles.avatar} ${styles[size]} ${className}`}
         aria-label={name}
         title={name}
      >
         {initials || '?'}
      </div>
   );
};

export default Avatar;
