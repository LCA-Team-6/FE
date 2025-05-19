import { css } from '@emotion/react';

// fontSize 정의
const fontSizeXl = '1.5rem'; // 24px
const fontSizeLg = '1.25rem'; // 20px
const fontSizeMd = '1rem'; // 16px
const fontSizeSm = '0.875rem'; // 14px
const fontSizeXs = '0.75rem'; // 12px

//color 정의
const colorWhite = '#FFFFFF';


export const GlobalStyle = css`
    :root {

        --font-size-xl: ${fontSizeXl};
        --font-size-lg: ${fontSizeLg};
        --font-size-md: ${fontSizeMd};
        --font-size-sm: ${fontSizeSm};
        --font-size-xs: ${fontSizeXs};

        --color-white: ${colorWhite};
        
    }
`;