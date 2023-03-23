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
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Barcode from 'react-barcode'
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import Axios from "axios";
import { createBrowserHistory } from 'history'
import { HOST_URL } from "../configure";
import logoImg from '../assets/logo_white.png'

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
        disablePadding: true,
        label: 'Status',
    },
    {
        id: 'category',
        numeric: true,
        disablePadding: true,
        label: 'Category',
    },
    {
        id: 'condition',
        numeric: true,
        disablePadding: true,
        label: 'Condition',
    },
    {
        id: 'oiginal_price',
        numeric: true,
        disablePadding: true,
        label: 'Original Price (£)',
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

            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Barter items
            </Typography>




            <Button onClick={handleAddClick} style={{ backgroundColor: '#ec5990', width: '330px', height: '50px', padding: '15px', borderRadius: '5px', marginRight: '10px' }} >
                <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                    <AddIcon sx={{ color: 'white' }} />
                    <div style={{ marginLeft: '10px' }}> Create new barter</div>
                </div>

            </Button>





        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function UserTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState([])
    const [showModal, setModal] = React.useState(false)

    const history = createBrowserHistory()

    useEffect(() => {
        drawCounter()
        Axios.get(HOST_URL + "/barter/" + localStorage.getItem("userId")).then((data) => {
            setRows(data.data)
            let idList = []
            data.data.map((v, i) => {
                idList.push(v.id)
            })

        });
    }, [])

    const drawCounter = () => {
        var canvas = document.getElementById("counter_canvas");
        var ctx = canvas.getContext("2d");
        let x = 150;
        let y = 75;

        ctx.beginPath();
        ctx.arc(x, y, 44, 0, 2 * Math.PI);
        ctx.fillStyle = "#28124b";
        ctx.fill();
        ctx.closePath();

        /*填充文字*/

        ctx.font = "12px Microsoft YaHei";
        /*文字颜色*/
        ctx.fillStyle = "#fff";
        /*文字内容*/
        var insertContent = "Points";
        var text = ctx.measureText(insertContent);
        /*插入文字，后面两个参数为文字的位置*/
        /*此处注意：text.width获得文字的宽度，然后就能计算出文字居中需要的x值*/
        ctx.fillText(insertContent, (2 * x - text.width) / 2, 58);

        /*填充百分比*/
        ctx.font = "18px Microsoft YaHei";
        ctx.fillStyle = "#e24464";
        var ratioStr = localStorage.getItem('points');
        var text = ctx.measureText(ratioStr);
        ctx.fillText(ratioStr, (2 * x - text.width) / 2, 85);

        /*开始圆环*/
        var circleObj = {
            ctx: ctx,
            /*圆心*/
            x: x,
            y: y,
            /*半径*/
            radius: 65,
            /*环的宽度*/
            lineWidth: 22,
            startAngle: 0,
            endAngle: Math.PI * 2,
        };

        var grd = ctx.createRadialGradient(x, y, 75, x, y, 30);
        grd.addColorStop(0, "rgba(255,255,255,0)");
        grd.addColorStop(1, "rgba(255,255,255,0.3)");

        /*有色的圆环*/
        /*从-90度的地方开始画*/

        circleObj.color = grd;
        drawCircle(circleObj);

        let raidus = 44;

        circleObj.radius = raidus;
        circleObj.lineWidth = 2;
        circleObj.color = "#720d77";
        drawCircle(circleObj);

        // circleObj.radius=46
        circleObj.lineWidth = 2;
        raidus = raidus + circleObj.lineWidth;
        circleObj.radius = raidus;
        circleObj.color = "rgba(255,255,255,0)";
        drawCircle(circleObj);

        circleObj.lineWidth = 3;
        raidus = raidus + circleObj.lineWidth;
        circleObj.radius = raidus;
        circleObj.color = "#3aa8db";
        drawCircle(circleObj);

        circleObj.lineWidth = 3;
        raidus = raidus + circleObj.lineWidth;
        circleObj.radius = raidus;
        circleObj.color = "rgba(255,255,255,0.1)";
        drawCircle(circleObj);

        ctx.setLineDash([4, 2]);
        circleObj.lineWidth = 2;
        raidus = raidus + circleObj.lineWidth;
        circleObj.radius = raidus;
        circleObj.color = "#3aa8db";
        drawCircle(circleObj);

        ctx.setLineDash([4, 4]);
        circleObj.lineWidth = 5;
        raidus = raidus + circleObj.lineWidth;
        circleObj.radius = raidus;
        circleObj.color = "rgba(58,168,219,0.3)";
        drawCircle(circleObj);
    };

    const drawCircle = (circleObj) => {
        var ctx = circleObj.ctx;
        ctx.beginPath();
        ctx.arc(
            circleObj.x,
            circleObj.y,
            circleObj.radius,
            circleObj.startAngle,
            circleObj.endAngle,
            false
        );
        //设定曲线粗细度
        ctx.lineWidth = circleObj.lineWidth;
        //给曲线着色
        ctx.strokeStyle = circleObj.color;
        //给环着色
        ctx.stroke();
        ctx.closePath();
    };

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


    const generateBarcode = () => {
        let points = localStorage.getItem('points')
        let code = '00'.concat(points)
        return code
    }

    const handleLogout = () => {
        localStorage.clear()
        history.replace({ pathname: '/', state: {} })
        history.go(0)
    }

    return (
        <Box sx={{ width: '100%', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
                <Button type="text" style={{ paddingRight: '20px' }} onClick={() => { handleLogout() }} >
                    <div style={{ color: "white", fontSize: '20px' }}> Logout</div>
                </Button>
            </div>

            <div className="title">
                <img style={{ width: '500px', margin: '30px' }} src={logoImg} alt="" />
            </div>

            <div id="counter" style={{ display: 'flex', justifyContent: 'center' }}>
                <canvas style={{ width: '600px' }} id="counter_canvas" />

            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" sx={{ marginBottom: '40px' }} onClick={() => { setModal(true) }} >
                    <div style={{ color: "white" }}> Barcode</div>
                </Button>
            </div>
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
                                                <Box sx={{ fontWeight: 'bold' }}>{row.name}</Box>

                                            </TableCell>
                                            <TableCell align="left">{status_list[row.status]}</TableCell>
                                            <TableCell align="left">{category_list[row.category]}</TableCell>
                                            <TableCell align="left">{condition_list[row.condition_cat / 25]}</TableCell>
                                            <TableCell align="center">{row.price}</TableCell>

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
                    {"Here is your barcode"}
                </DialogTitle>
                <DialogContent>
                    {showModal ? <Barcode value={showModal ? generateBarcode() : ""} displayValue={false} /> : null}

                </DialogContent>
                <DialogActions>
                    <Button type="text" onClick={() => { setModal(false) }} >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>
    );
}