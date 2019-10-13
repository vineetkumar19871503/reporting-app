const config = require("./config");
const navItems = {
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
      name: 'Users',
      url: '/users',
      icon: 'icon-user',
      children: [
        {
          name: 'Add User',
          url: '/users/add',
          icon: 'icon-plus',
        },
        {
          name: 'Users List',
          url: '/users/list',
          icon: 'icon-list',
        }
      ]
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
  ]
};

function filterNavItems(userPermissions) {
  try {
    let filteredNavItems = {};
    for (var key in userPermissions) {
      if (userPermissions.hasOwnProperty(key)) {
        filteredNavItems[userPermissions[key].path] = userPermissions[key].granted;
      }
    }
    return filteredNavItems;
  } catch (err) {
    console.error(err);
    return {};
  }
}

function getNavItems(userPermissions, isAdmin) {
  if (isAdmin === true) {
    return navItems;
  }
  if (!userPermissions) {
    return { "items": [] };
  }
  const allowedUrls = config.allowedPageUrls;
  userPermissions = filterNavItems(userPermissions);
  let navArr = navItems.items;
  let filteredNavArr = [];
  for (let navIt = 0; navIt < navArr.length; navIt++) {
    const n = navArr[navIt];
    if (allowedUrls[n.url] === true) {
      filteredNavArr.push(n);
      continue;
    }
    if (n.children) {
      let filteredChildNav = [];
      for (let chNavIt = 0; chNavIt < n.children.length; chNavIt++) {
        const cn = n.children[chNavIt];
        if (userPermissions[cn.url]) {
          filteredChildNav.push(cn);
        }
      }
      if (filteredChildNav.length > 0) {
        n.children = filteredChildNav;
        filteredNavArr.push(n);
      }
    } else if (userPermissions[n.url] || userPermissions[n.url] === undefined) {
      filteredNavArr.push(n);
    }
  }
  return { "items": filteredNavArr };
}
module.exports = { getNavItems, navItems };