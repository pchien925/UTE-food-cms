import { navMenuConfig } from '@constants/menuConfig';
import routes from '@routes';
import { validatePermission } from '@utils';

function useFirstActiveRoute(prop) {
    const { profile } = prop;

    function findFirstValidRoute(navs) {
        console.log(profile);
        for (const nav of navs) {
            if (!nav) continue;

            if (nav.isSuperAdmin && !profile?.isSuperAdmin) {
                continue;
            }

            const hasPermission =
                (!nav.permission && !nav.kind) ||
                validatePermission(nav.permission, profile?.permissions);

            if (!hasPermission) continue;

            if (nav.children && nav.children.length > 0) {
                const child = findFirstValidRoute(nav.children);
                if (child) return child;
            }

            if (nav.path) return nav;
        }

        return null;
    }

    const route = findFirstValidRoute(navMenuConfig);
    if (!route) return routes.loginPage.path;
    let path = route.path || '';

    if (route.query) {
        const queryString = new URLSearchParams(route.query)?.toString();
        if (queryString) {
            path += `?${queryString}`;
        }
    }

    return path;
}

export default useFirstActiveRoute;
