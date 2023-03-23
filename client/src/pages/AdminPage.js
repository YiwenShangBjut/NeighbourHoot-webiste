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
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import logoImg from '../assets/logo_black.png'

const status_list = ["Pending", "Approved", "Listed", "Sold", "Refused"]
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
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
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
                        align={'left'}
                        padding={'16px'}
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

        

            <div>
                <img style={{width:'300px', margin:'10px'}} src={logoImg} alt="" />
            </div>

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
    const [isApprove, setIsApprove] = React.useState(false)
    const [successful, setSuccessful] = React.useState(false)

    useEffect(() => {
        updateBarterList()
    }, [])

    const updateBarterList = () => {
        Axios.get(HOST_URL + "/barter").then((data) => {
            setRows(data.data)
            let idList = []
            data.data.map((v, i) => {
                idList.push(v.id)
            })
            setRowIdList(idList)
        });
    }

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

    const handleClickAction = (approve, id) => {

        setSelectedIndex(rowIdList.indexOf(id))
        setActionModal(true)
        setIsApprove(approve)
    };

    const details = (row) => {

        return (
            <Link onClick={(event) => handleClickDetails(event, row.id)}>See detials</Link>
        )
    }

    const action = (row) => {
        return (<div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button onClick={() => handleClickAction(true, row.id)} style={{ backgroundColor: '#90b28d', width: '70px', height: '25px', padding: '5px', borderRadius: '10px', marginRight: '10px' }} >
                <div style={{ color: "white", fontSize: '10px' }}> Approve</div>
            </Button>

            <Button onClick={() => handleClickAction(false, row.id)} style={{ backgroundColor: '#c85863', width: '70px', height: '25px', padding: '5px', borderRadius: '10px' }} >
                <div style={{ color: "white", fontSize: '10px' }}> Reject</div>
            </Button>
        </div>
        )

    }

    const detailDialogAction = (index) => {
        if (rows[index]) {
            if (rows[index].status == 0) {
                return (
                    <div style={{ display: 'flex', flexDirection: 'row', margin: '30px' }}>

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

    const showAlert = () => {
        setSuccessful(true)
        setTimeout(() => {
            // After 3 seconds set the show value to false
            setSuccessful(false)
        }, 3000)
    }

    const handleAction = () => {
        if (isApprove) {
            Axios.put(HOST_URL + "/update/barter", { id: rows[selectedIndex].id, status: 1 }).then((response) => {
                setActionModal(false)
                updateBarterList()
                showAlert()

            });
        } else {
            Axios.put(HOST_URL + "/update/barter", { id: rows[selectedIndex].id, status: 4 }).then((response) => {
                setActionModal(false)
                updateBarterList()
                showAlert()
            });
        }
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
        <Box sx={{ width: '100%', paddingTop: '20px' }}>
            {
                successful ? <Slide direction="left" in={successful} mountOnEnter unmountOnExit>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Alert sx={{ width: '20%', mb: 2, marginButton: '30px' }} severity="success">You successfully update the status of item</Alert>
                    </div>
                </Slide> : <div style={{ height: '45px', width: '100%' }}></div>
            }

            <Paper sx={{ width: '50%', mb: 2, margin: '0 auto' }}>
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
                        <TableBody sx={{ paddingX: '20px' }}>
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
                                                align="left"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="left">{status_list[row.status]}</TableCell>
                                            <TableCell align="left">{details(row)}</TableCell>
                                            <TableCell align="center">{action(row)}</TableCell>
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
                        <div style={detailStyle}><div style={detailTitleStyle}>Price:</div> {rows[selectedIndex] ? rows[selectedIndex].price : ''}</div>
                        <div style={detailStyle}><div style={detailTitleStyle}>Description:</div> {rows[selectedIndex] ? rows[selectedIndex].description : ''}</div>

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
                    {"Please confirm"}

                </DialogTitle>
                <DialogContent >
                    <div sytle={{ fontSize: '15px', display: 'flex', flexDirection: 'row' }}>
                        {isApprove ? <DoneOutlineIcon fontSize="small" sx={{ marginRight: '8px', color: "#90b28d" }} /> : <RemoveCircleOutlineIcon fontSize="small" sx={{ marginRight: '8px', color: "#c85863" }} />}
                        {isApprove ? "You are going to approve this item to be listed." : "You are going to refuse this item to be listed"}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button sx={{ marginLeft: '20px' }} onClick={() => { handleAction(selectedIndex) }} >
                        <div style={{ color: "#ec5990" }}> Yes</div>
                    </Button>
                    <Button type="text" onClick={() => { setActionModal(false) }} >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}