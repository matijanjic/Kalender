import { Link, useResolvedPath, useMatch } from 'react-router-dom';

function CustomLink({ children, to, className, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link
        className={match ? 'nav-button-active' : 'nav-button'}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </div>
  );
}

export default CustomLink;
