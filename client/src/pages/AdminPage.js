import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import Axios from "axios";
import { createBrowserHistory } from 'history'
import { HOST_URL } from "../configure";


const status_list = ["Pending", "Decided", "Listed", "Sold"]
const category_list = ["Clothing", "Electronics", "Books", "Others"]
const condition_list = ["", "Fair", "Good", "Very good", "Never Worn"]

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'oiginal_price',
        numeric: true,
        disablePadding: true,
        label: 'Original Price (£)',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    },
    {
        id: 'determined',
        numeric: true,
        disablePadding: false,
        label: 'Decided Price (£)',
    },
    {
        id: 'details',
        numeric: true,
        disablePadding: false,
        label: 'Details',
    },
    {
        id: 'action',
        numeric: true,
        disablePadding: false,
        label: 'Action',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">

                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    const history = createBrowserHistory()
    const handleAddClick = () => {
        history.replace({ pathname: '/create', state: {} })
        history.go(0)
    }
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >

            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Community Barter
            </Typography>



            <Tooltip title="Create new barter">
                <IconButton size="large" sx={{ padding: '1px' }} onClick={handleAddClick}>
                    <AddIcon className="addButton" />
                </IconButton>
            </Tooltip>


        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function AdminPage() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState([])
    const [showModal, setModal] = React.useState(false)
    const [rowIdList, setRowIdList] = React.useState([])
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [showActionModal, setActionModal] = React.useState(false)
    const [decidedPrice, setDecidedPrice] = React.useState(0)

    useEffect(() => {
        Axios.get(HOST_URL + "/barter").then((data) => {
            setRows(data.data)
            let idList = []
            data.data.map((v, i) => {
                idList.push(v.id)
            })
            setRowIdList(idList)
        });
    }, [])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleClickDetails = (event, id) => {
        console.log('id is', id)
        console.log("rowIdList:", rowIdList)

        setSelectedIndex(rowIdList.indexOf(id))
        setModal(true)
    };

    const handleClickAction = (event, id) => {
        console.log('id is', id)
        console.log("rowIdList:", rowIdList)

        setSelectedIndex(rowIdList.indexOf(id))
        setActionModal(true)
    };

    const decidedPriceText = (index) => {
        if (rows[index]) {
            if (rows[index].status == 0) {
                return (<div style={detailStyle}><div style={detailTitleStyle}>Decide Price:</div> {'Wait to decide'}</div>)
            } else {
                return (<div style={detailStyle}><div style={detailTitleStyle}>Decide Price:</div>  {rows[index].deal_price}</div>)
            }
        } else {
            return
        }
    }

    const details = (row) => {

        return (
            <Link onClick={(event) => handleClickDetails(event, row.id)}>See detials</Link>
        )
    }

    const action = (row) => {
        if(row.status==0){
            return (
                <Link onClick={(event) => handleClickAction(event, row.id)}>Decide price</Link>
            )
        }else{
            return(
                <div style={{color:'c0c0c0'}}></div>
            )
        }

    }

    const detailDialogAction = (index) => {
        if (rows[index]) {
            if (rows[index].status == 0) {
                return (
                    <div style={{ display: 'flex', flexDirection: 'row', margin: '30px' }}>
                        <Button sx={{ marginLeft: '20px' }} onClick={() => { setModal(false); setActionModal(true) }} >
                            <div style={{ color: "#ec5990" }}> Decide price</div>
                        </Button>
                        <Button type="text" onClick={() => { setModal(false) }} >
                            Close
                        </Button>
                    </div>
                )
            }
        } else {
            return
        }


    }

    const handleSubmitPrice = () => {
        Axios.put(HOST_URL + "/update", { id: localStorage.getItem('userId'), status: 1, price: decidedPrice }).then((response) => {

            setActionModal(false)
        });

    }

    const detailStyle = {
        display: 'flex',
        flexDirection: 'row',
        margin: '20px'
    }

    const detailTitleStyle = {
        marginRight: '10px',
        fontWeight: 'bold'
    }

    return (
        <Box sx={{ width: '100%', paddingTop: '50px' }}>
            <Paper sx={{ width: '80%', mb: 2, margin: '0 auto' }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow>
                                            <TableCell >

                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.price}</TableCell>
                                            <TableCell align="right">{status_list[row.status]}</TableCell>
                                            <TableCell align="right">{row.status == 0 ? 'wait to decide' : row.deal_price}</TableCell>
                                            <TableCell align="right">{details(row)}</TableCell>
                                            <TableCell align="right">{action(row)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog
                open={showModal}
                onClose={() => setModal(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Details"}
                </DialogTitle>
                <DialogContent >
                    <div>
                        <div style={detailStyle}><div style={detailTitleStyle}>Name:</div> {rows[selectedIndex] ? rows[selectedIndex].name : ''}</div>
                        <div style={detailStyle}><div style={detailTitleStyle}>Stauts:</div> {rows[selectedIndex] ? status_list[rows[selectedIndex].status] : ''}</div>
                        <div style={detailStyle}><div style={detailTitleStyle}>Category:</div> {rows[selectedIndex] ? category_list[rows[selectedIndex].category] : ''}</div>
                        <div style={detailStyle}><div style={detailTitleStyle}>Condition:</div>{rows[selectedIndex] ? condition_list[rows[selectedIndex].condition_cat / 25] : ''}</div>
                        <div style={detailStyle}><div style={detailTitleStyle}>Original Price:</div> {rows[selectedIndex] ? rows[selectedIndex].price : ''}</div>
                        <div style={detailStyle}><div style={detailTitleStyle}>Description:</div> {rows[selectedIndex] ? rows[selectedIndex].description : ''}</div>
                        {decidedPriceText(selectedIndex)}

                    </div>


                </DialogContent>
                <DialogActions>
                    {detailDialogAction(selectedIndex)}
                </DialogActions>
            </Dialog>

            <Dialog
                open={showActionModal}
                onClose={() => setActionModal(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Decide a price for this item"}
                </DialogTitle>
                <DialogContent >
                    <div>

                        <input style={{ borderColor: "#333" }} required placeholder="Price" onChange={(event) => {
                            setDecidedPrice(event.target.value)
                        }} />

                    </div>


                </DialogContent>
                <DialogActions>
                    <Button sx={{ marginLeft: '20px' }} onClick={() => { handleSubmitPrice() }} >
                        <div style={{ color: "#ec5990" }}> Submit</div>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}