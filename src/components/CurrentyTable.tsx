import React, {useCallback, useEffect, useState} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel, getSortedRowModel, SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { CurrencyDetail } from '../services/types';
import Money from './cells/Money';
import Percent from './cells/Percent';
import { getTickers } from '../services/api';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  styled,
} from '@mui/material';
import CatgirlExplainer from './CatgirlExplainer';
import { useCatgirlExplainer } from '../services/catgirl';
import Coin from './cells/Coin';
import { useAsync } from '@react-hookz/web';

const columnHelper = createColumnHelper<CurrencyDetail>();

const HeaderCellText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

const columns = [
  columnHelper.accessor('symbol', {
    cell: (info) => <Coin>{info.getValue()}</Coin>,
    header: () => <HeaderCellText>Symbol</HeaderCellText>,
  }),
  columnHelper.accessor('bid', {
    cell: (info) => <Money>{info.getValue()}</Money>,
    header: () => <HeaderCellText align={'right'}>Bid</HeaderCellText>,
  }),
  columnHelper.accessor('ask', {
    cell: (info) => <Money>{info.getValue()}</Money>,
    header: () => <HeaderCellText align={'right'}>Ask</HeaderCellText>,
  }),
  columnHelper.accessor('last', {
    cell: (info) => <Money>{info.getValue()}</Money>,
    header: () => <HeaderCellText align={'right'}>Last</HeaderCellText>,
  }),
  columnHelper.accessor('dailyHigh', {
    cell: (info) => <Money>{info.getValue()}</Money>,
    header: () => <HeaderCellText align={'right'}>Daily High</HeaderCellText>,
  }),
  columnHelper.accessor('dailyChangePercent', {
    cell: (info) => <Percent>{info.getValue()}</Percent>,
    header: () => <HeaderCellText align={'right'}>Change, %</HeaderCellText>,
  }),
  columnHelper.accessor('dailyLow', {
    cell: (info) => <Money>{info.getValue()}</Money>,
    header: () => <HeaderCellText align={'right'}>Daily Low</HeaderCellText>,
  }),
  columnHelper.accessor('dailyVolume', {
    cell: (info) => <Money>{info.getValue()}</Money>,
    header: () => <HeaderCellText align={'right'}>Volume</HeaderCellText>,
  }),
];

const CurrencyTable: React.FC = () => {
  const [{ result, status }, { execute }] = useAsync<CurrencyDetail[]>(() =>
    getTickers(['BTC', 'ETH', 'XRP', 'LTC']),
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  useEffect(() => {
    execute();
  }, []);

  const table = useReactTable({
    data: result || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  const reloadTable = useCallback(() => {
    execute();
  }, []);

  const { isShown: isExplainerShown, toggle: toggleShowExplainer } =
    useCatgirlExplainer();

  if (status === 'loading')
    return (
      <Box textAlign={'center'}>
        <CircularProgress />
      </Box>
    );
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Button onClick={reloadTable} variant={'contained'}>
          Reload data
        </Button>{' '}
        <Button onClick={toggleShowExplainer}>
          {isExplainerShown ? 'Hide' : 'Show'} Explainer
        </Button>
      </Box>
      {isExplainerShown && (
        <Box mb={3}>
          <CatgirlExplainer />
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                      key={header.id} >
                    {header.isPlaceholder
                        ? null
                        :
                        <div
                            {...{
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                        >
                          {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CurrencyTable;
