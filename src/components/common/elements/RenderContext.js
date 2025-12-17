import React from 'react';
import useDevices from '@hooks/useDevices';

import PageNotFound from '../page/PageNotFound';
import useAuth from '@hooks/useAuth';

const RenderContext = ({ layout, components, layoutProps, ...props }) => {
    const { isMobile } = useDevices();
    const { isSuperAdmin } = useAuth();
    const ComponentRender =
        ((isMobile && !isSuperAdmin) ? components?.mobile?.defaultTheme : components?.desktop?.defaultTheme) || PageNotFound;
    return (
        <ComponentRender {...props} />
    );
};

export default RenderContext;
