export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      // badge: {
      //   variant: 'info',
      //   text: 'NEW',
      // },
    },
    {
      name: 'Bills',
      url: '/bills',
      icon: 'icon-folder',
      children: [
        {
          name: 'Add Bill',
          url: '/bills/add',
          icon: 'icon-plus',
        },
        {
          name: 'Bills List',
          url: '/bills/list',
          icon: 'icon-list',
        }
      ]
    },
    {
      name: 'BSNL Cable',
      url: '/bsnl-cable',
      icon: 'icon-plus'
    },
    {
      name: 'Discom Pole',
      url: '/discom-pole',
      icon: 'icon-plus'
    },
    {
      name: 'Discom LED',
      url: '/discom-led',
      icon: 'icon-plus'
    },
    {
      name: 'Discom Wallet',
      url: '/discom-wallet',
      icon: 'icon-plus'
    },
    {
      name: 'High Court',
      url: '/high-court',
      icon: 'icon-plus'
    },
    {
      name: 'Machiya',
      url: '/machiya',
      icon: 'icon-plus'
    },
    {
      name: 'Yavukush',
      url: '/yavukush',
      icon: 'icon-plus'
    },
    {
      name: 'General Receipt',
      url: '/general-receipt',
      icon: 'icon-plus'
    },
    // {
    //   name: 'Users',
    //   url: '/users',
    //   icon: 'icon-user',
    //   children: [
    //     {
    //       name: 'Add User',
    //       url: '/users/add',
    //       icon: 'icon-plus',
    //     },
    //     {
    //       name: 'Users List',
    //       url: '/users/list',
    //       icon: 'icon-list',
    //     }
    //   ]
    // },
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
