import R from "ramda";
import qs from "qs";

const util = {
  windowIsLargerThanSmall: width => {
    // variables.scss; $break-small: 576px;
    return width > 576;
  },
  windowIsLargerThanMedium: width => {
    // variables.scss; $break-medium: 768px;
    return width > 768;
  },
  moneyFormat: num => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    });

    return formatter.format(num);
  },
  toggleItem: (items, item) => {
    return R.contains(item, items)
      ? R.reject(R.equals(item), items)
      : R.append(item, items);
  },
  getInitialBodyStyleFromUrl: () => {
    return R.prop("style", qs.parse(window.location.search.slice(1)));
  },
  fromRefreshed: () => {
    return window.performance.navigation.type === 1;
  },
  fromBackForward: () => {
    return window.performance.navigation.type === 2;
  },
  wasReferredFromHomePage: () => {
    if (util.fromRefreshed() || util.fromBackForward()) {
      return false;
    }

    let temp = document.createElement("a");

    temp.href = document.referrer;

    return window.document.origin === temp.origin && temp.pathname === "/";
  },
  numbersWithCommas: num => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0
    });

    return formatter.format(num);
  },
  sameStateSchema(a, b) {
    return (
      JSON.stringify(Object.keys(a).sort()) ===
      JSON.stringify(Object.keys(b).sort())
    );
  },
  getClosestNumberInRange(value, values) {
    // Ensure order of values is ascending
    values.sort();

    // Bind to lowest or highest.
    if (value < values[0]) {
      return values[0];
    } else if (value > values[values.length - 1]) {
      return values[values.length - 1];
    }

    // Exact value.
    if (R.contains(value, values)) {
      return value;
    }

    const zipped = R.zip(R.reverse(R.tail(R.reverse(values))), R.tail(values));

    // Find closest.
    return R.reduce(
      (closest, [low, high]) => {
        if (closest > low && closest < high) {
          const diffLow = closest - low;
          const diffHigh = high - closest;

          return diffLow > diffHigh ? high : low;
        }

        return closest;
      },
      value,
      zipped
    );
  }
};

export default util;
