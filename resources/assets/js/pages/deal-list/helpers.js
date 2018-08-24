import queryString from 'query-string';

/**
 *
 * @param searchQuery
 */
export const buildSearchQueryUrl = searchQuery => {
    const qsData = { ...searchQuery };
    delete qsData.location;
    return queryString.stringify(qsData, { arrayFormat: 'bracket' });
};
