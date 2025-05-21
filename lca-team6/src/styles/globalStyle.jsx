import { css } from '@emotion/react';

// fontSize 정의
const fontSizeXl = '1.5rem'; // 24px
const fontSizeLg = '1.25rem'; // 20px
const fontSizeMd = '1rem'; // 16px
const fontSizeSm = '0.875rem'; // 14px
const fontSizeXs = '0.75rem'; // 12px

//color 정의
const colorWhite = '#FFFFFF';

const colorBrown = '#CB997E';
const colorDarkBrown = '#4B3E36'
const colorLightBrown = '#DDBEA9';
const colorBeige = '#FFE8D6';
const colorLightGreen = '#B7B7A4';
const colorGreen = '#A5A58D';
const colorDarkGreen = '#6B705C';
const colorLightGray = '#F8F9FA';



export const GlobalStyle = css`
    :root {

        --font-size-xl: ${fontSizeXl};
        --font-size-lg: ${fontSizeLg};
        --font-size-md: ${fontSizeMd};
        --font-size-sm: ${fontSizeSm};
        --font-size-xs: ${fontSizeXs};

        --color-white: ${colorWhite};
        --color-brown: ${colorBrown};
        --color-light-brown: ${colorLightBrown};
        --color-beige: ${colorBeige};
        --color-light-green: ${colorLightGreen};
        --color-green: ${colorGreen};
        --color-dark-green: ${colorDarkGreen};
        --color-dark-brown: ${colorDarkBrown};
        --color-light-gray: ${colorLightGray};
`;