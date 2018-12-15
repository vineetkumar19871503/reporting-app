export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      name: 'Bills',
      url: '/bills',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Add Bill',
          url: '/bills/add',
          icon: 'icon-cursor',
        },
        {
          name: 'Bills List',
          url: '/bills/list',
          icon: 'icon-cursor',
        }
      ]
    },
    {
      name: 'Users',
      url: '/users',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Add User',
          url: '/users/add',
          icon: 'icon-cursor',
        },
        {
          name: 'Users List',
          url: '/users/list',
          icon: 'icon-cursor',
        }
      ]
    },
    // {
    //   name: 'Buttons',
    //   url: '/buttons',
    //   icon: 'icon-cursor',
    //   children: [
    //     {
    //       name: 'Buttons',
    //       url: '/buttons/buttons',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Button dropdowns',
    //       url: '/buttons/button-dropdowns',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Button groups',
    //       url: '/buttons/button-groups',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Brand Buttons',
    //       url: '/buttons/brand-buttons',
    //       icon: 'icon-cursor',
    //     },
    //   ],
    // },
  ],
};
