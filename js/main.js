window.addEventListener('DOMContentLoaded', async (e) => {
  const navigationDOM = document.querySelector('.nav-items');
  const dateDOM = document.querySelector('.date');

  /**
   * Fetch menu items
   * @async
   */
  const fetchNavigation = async () => {
    try {
      const { cities } = await fetch('./js/navigation.json')
        .then((response) => response.json())
        .then((obj) => obj);
      printNav(cities);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Create template of nav items
   * @param {{section: string, label: string}[]} navData
   * @returns {string} HTMLElement
   */
  const createNav = (navData) => {
    return navData.map((nav) => {
      const { section, label } = nav;
      return `<li class="nav-item"><button class=${section}>${label}</button></li>`;
    });
  };

  /**
   * Add nav items to nav container. Add hr before end of container
   * @param {{section: string, label: string}[]} navData
   */
  const printNav = (navData) => {
    const underline = '<hr id="underline">';
    const navItems = createNav(navData).join('');
    navigationDOM.innerHTML = navItems;
    navigationDOM.insertAdjacentHTML('beforeend', underline);
  };

  // fetch navigation
  await fetchNavigation();

  const underlineDOM = document.getElementById('underline');
  const navItemsDOM = document.querySelectorAll('.nav-item');

  /**
   * Initialize timezone based on timezone parameter. Append to dateDOM
   * @param {string} timeZone
   */
  const initializeTime = (timeZone) => {
    const date = new Date();
    options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone,
      hour12: false,
      timeZoneName: 'short',
    };
    const dateTime = new Intl.DateTimeFormat('en-US', options).format(date);
    dateDOM.innerText = dateTime;
  };

  /**
   * set active nav item, if innerText is same as iterate innerText, set active
   * @param {HTMLElement} activeNav
   */
  const setNavActive = (activeNav) => {
    navItemsDOM.forEach((nav) => {
      if (nav.innerText === activeNav.innerText) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });
  };

  if (navItemsDOM) {
    // initialize first nav item as active
    const firstNavItem = navItemsDOM[0];
    firstNavItem.classList.add('active');
    underlineDOM.style.width = firstNavItem.clientWidth + 'px';
    underlineDOM.style.left = firstNavItem.offsetLeft + 'px';
    initializeTime('America/Los_Angeles');
    // Add click to the nav
    navItemsDOM.forEach((nav) => {
      nav.addEventListener('click', (e) => {
        const { offsetLeft, clientWidth, innerText } = e.target;
        setNavActive(nav);
        getTimezone(innerText);
        underlineDOM.style.width = clientWidth + 'px';
        underlineDOM.style.left = offsetLeft + 'px';
      });
    });
  } else {
    console.log('navItemDOM is not available');
  }

  /**
   * call initializeTime depends on the city name
   * @param {string} cityName
   */
  const getTimezone = (cityName) => {
    switch (cityName) {
      case 'Cupertino':
        initializeTime('America/Los_Angeles');
        break;
      case 'New York City':
        initializeTime('America/New_York');
        break;
      case 'London':
        initializeTime('Europe/London');
        break;
      case 'Amsterdam':
        initializeTime('Europe/Amsterdam');
        break;
      case 'Tokyo':
        initializeTime('Asia/Tokyo');
        break;
      case 'Hong Kong':
        initializeTime('Asia/Hong_Kong');
        break;
      case 'Sydney':
        initializeTime('Australia/Sydney');
        break;
      default:
        break;
    }
  };
});
