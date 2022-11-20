import React from 'react';
import { Typography } from '@mui/material';
import styled from "@emotion/styled";

interface IPercent {
    positive: boolean;
}

const StyledPercent = styled(Typography)<IPercent>`
  color: ${({positive})=> positive?"green":"red"};
`

const Percent: React.FC<{ children: number | string }> = ({ children }) => {
    return (
        <StyledPercent textAlign='right' variant={'body2'} positive={Number(children)>0}>
            {`${(Number(children)*100).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}%`}
        </StyledPercent>
    );
};

export default Percent;
