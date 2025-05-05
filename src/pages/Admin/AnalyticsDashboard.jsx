import { useContext, useEffect, useState } from "react";
import * as React from 'react';
import { getAllUsersDB, getUserByTokenDB } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../provider/appProvider";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getAllActionLogDB } from "../../services/verifyAPI";

export const AnalyticsDashboard = () => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const action_column = [
        { id: 'ALID', label: 'ALID', minWidth: 50 },
        { id: 'TYPE', label: 'TYPE', minWidth: 50 },
        { id: 'ACTION', label: 'ACTION', minWidth: 50 },
        { id: 'ACTION_BY', label: 'ACTION_BY', minWidth: 50 },
    ];

    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    const appData = useContext(AppContext);
    const [logs, setLogs] = useState([]);
    const [backupLog, setBackupLog] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [selectedAction, setSelectedAction] = useState('all');
    const [totalNoOfVerifications, setTotalNoOfVerifications] = useState(0);
    const [totalNoOfSuccessFullVerifications, setTotalNoOfSuccessFullVerifications] = useState(0);
    const [totalNoOfFailedVerifications, setTotalNoOfFailedVerifications] = useState(0);
    const [totalProcess, setTotalProcess] = useState(0);
    const [totalSuccessProcess, setTotalSuccessProcess] = useState(0);
    const [totalFailedProcess, setTotalFailedProcess] = useState(0);


    const getAllActionLogs = async () => {
        var res = await getAllActionLogDB();
        if (res.success) {
            var reverse_logs = res.actionLogs.reverse();
            setBackupLog(reverse_logs);
            setLogs(reverse_logs);
            const t_logs = reverse_logs.filter((item) => item.TYPE === 'document');
            const t_log_success = t_logs.filter((item) => item.ACTION === 'verification_success');
            const t_log_failed = t_logs.filter((item) => item.ACTION === 'verification_failed');
            const p_logs = reverse_logs.filter((item) => item.TYPE === 'process');
            const p_log_success = p_logs.filter((item) => item.ACTION === 'approved');
            const p_log_failed = p_logs.filter((item) => item.ACTION === 'rejected');
            setTotalProcess(p_log_success.length + p_log_failed.length);
            setTotalSuccessProcess(p_log_success.length);
            setTotalFailedProcess(p_log_failed.length);
            setTotalNoOfSuccessFullVerifications(t_log_success.length);
            setTotalNoOfFailedVerifications(t_log_failed.length);
            setTotalNoOfVerifications(t_log_success.length + t_log_failed.length);
        }
        else {
            alert(res.message);
        }
        setLoading(false);
    };


    useEffect(() => {
        getAllActionLogs();
    }
        , []);

    const types = [
        'all',
        'auth',
        'process',
        'document',
    ];

    const auth_actions = [
        'all',
        'login',
        'register',
        'logout',
    ];

    const process_actions = [
        'all',
        'approved',
        'rejected',
        'updated',
        'created'
    ];

    const document_actions = [
        'all',
        'restored',
        'revoked',
        'created',
        'verification_success',
        'verification_failed'
    ];




    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
        }}>
            <h3 style={{
                fontSize: 18,
                fontWeight: '500',
                padding: 20
            }}> Action Logs </h3>
            <div style={{
                display: 'flex',
                gap: 20,
                padding: 20
            }}>
                <select onChange={(e) => {
                    setSelectedType(e.target.value);
                    if (e.target.value == 'all') {
                        setLogs(backupLog);
                        return;
                    }
                    const t_logs = backupLog.filter((item) => item.TYPE === e.target.value);
                    setLogs(t_logs);
                }} style={{
                    margin: '0 20px',
                    marginLeft: 0,
                    marginRight: 0,
                    padding: '10px 26px'
                }} name="type" id="type">
                    {types.map((type) => {
                        return <option value={type}>{type}</option>
                    })}
                </select>

                {
                    selectedType !== 'all' ? <select style={{
                        margin: '0 20px',
                        marginLeft: 0,
                        padding: '10px 26px'
                    }} onChange={(e) => {
                        if (e.target.value == 'all') {
                            const t_log_all = backupLog.filter((item) => item.TYPE === selectedType);
                            setLogs(t_log_all);
                            return;
                        }
                        const t_logs = backupLog.filter((item) => item.ACTION === e.target.value);
                        setLogs(t_logs);
                        setSelectedAction(e.target.value);
                    }}name="action" id="action">
                        {
                            selectedType === 'auth' ? auth_actions.map((action) => {
                                return <option value={action}>{action}</option>
                            }) : ''
                        }
                        {
                            selectedType === 'process' ? process_actions.map((action) => {
                                return <option value={action}>{action}</option>
                            }) : ''
                        }
                        {
                            selectedType === 'document' ? document_actions.map((action) => {
                                return <option value={action}>{action}</option>
                            }) : ''
                        }
                    </select> : ''
                }
            </div>
            <div style={{
                padding: 20,
            }} className="iss-ver-cont">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {action_column.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, rowIndex) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                            {action_column.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.customRender
                                                            ? column.customRender(row)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={logs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>

            <h3 style={{
                fontSize: 18,
                fontWeight: '500',
                padding: 20
            }}> Verification Analytics </h3>

            <select onChange={(e) => {
                var t_logs = backupLog.filter((item) => item.TYPE === "document");
                if (e.target.value === 'all') {
                    const t_log_success = t_logs.filter((item) => item.ACTION === 'verification_success');
                    const t_log_failed = t_logs.filter((item) => item.ACTION === 'verification_failed');
                    setTotalNoOfSuccessFullVerifications(t_log_success.length);
                    setTotalNoOfFailedVerifications(t_log_failed.length);
                    setTotalNoOfVerifications(t_log_success.length + t_log_failed.length);
                }
                else if (e.target.value === '24-hours') {
                    const filtered_for_24_hours = t_logs.filter((item) => {
                        var date = item.createdAt;
                        var n_date = new Date(date);
                        var c_date = new Date();
                        return n_date.getDate() === c_date.getDate();
                    });
                    const t_log_success = filtered_for_24_hours.filter((item) => item.ACTION === 'verification_success');
                    const t_log_failed = filtered_for_24_hours.filter((item) => item.ACTION === 'verification_failed');
                    setTotalNoOfSuccessFullVerifications(t_log_success.length);
                    setTotalNoOfFailedVerifications(t_log_failed.length);
                    setTotalNoOfVerifications(t_log_success.length + t_log_failed.length);

                }
                else if (e.target.value === 'week') {
                    const filtered_for_month = t_logs.filter((item) => {
                        var date = item.createdAt;
                        var n_date = new Date(date);
                        var c_date = new Date();
                        return n_date.getMonth() === c_date.getMonth();
                    });
                    const t_log_success = filtered_for_month.filter((item) => item.ACTION === 'verification_success');
                    const t_log_failed = filtered_for_month.filter((item) => item.ACTION === 'verification_failed');
                    setTotalNoOfSuccessFullVerifications(t_log_success.length);
                    setTotalNoOfFailedVerifications(t_log_failed.length);
                    setTotalNoOfVerifications(t_log_success.length + t_log_failed.length);
                }
                else if (e.target.value === 'month') {
                    const filtered_for_month = t_logs.filter((item) => {
                        var date = item.createdAt;
                        var n_date = new Date(date);
                        var c_date = new Date();
                        return n_date.getMonth() === c_date.getMonth();
                    });
                    const t_log_success = filtered_for_month.filter((item) => item.ACTION === 'verification_success');
                    const t_log_failed = filtered_for_month.filter((item) => item.ACTION === 'verification_failed');
                    setTotalNoOfSuccessFullVerifications(t_log_success.length);
                    setTotalNoOfFailedVerifications(t_log_failed.length);
                    setTotalNoOfVerifications(t_log_success.length + t_log_failed.length);
                }
                else if (e.target.value === 'year') {
                    const filtered_for_year = t_logs.filter((item) => {
                        var date = item.createdAt;
                        var n_date = new Date(date);
                        var c_date = new Date();
                        return n_date.getFullYear() === c_date.getFullYear();
                    });
                    const t_log_success = filtered_for_year.filter((item) => item.ACTION === 'verification_success');
                    const t_log_failed = filtered_for_year.filter((item) => item.ACTION === 'verification_failed');
                    setTotalNoOfSuccessFullVerifications(t_log_success.length);
                    setTotalNoOfFailedVerifications(t_log_failed.length);
                    setTotalNoOfVerifications(t_log_success.length + t_log_failed.length);
                }
            }} style={{
                margin: '0 20px',
                padding: '10px 26px'
            }} name="analy_date" id="analy_date">
                <option value="all">All Time</option>
                <option value="24-hours">Past 24 Hour</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
            </select>

            <div style={{
                padding: 20,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 20
            }}>

                <div style={{
                    height: 150,
                    borderRadius: 10,
                    textAlign: 'center',
                    flex: 1,
                    backgroundColor: '#6790ff3a'
                }} className="fl-cont">
                    <h4 style={{
                        fontSize: 15,
                        fontWeight: '500',
                        padding: 15,
                        textAlign: 'center'
                    }}>Total verification Done</h4>

                    <span style={{
                        fontSize: 30,
                        fontWeight: '700',
                        textAlign: 'center',
                        color: 'blue'
                    }}>
                        {totalNoOfVerifications}
                    </span>

                </div>


                <div style={{
                    height: 150,
                    borderRadius: 10,
                    textAlign: 'center',
                    flex: 1,
                    backgroundColor: '#76ffaf9a'
                }} className="fl-cont">
                    <h4 style={{
                        fontSize: 15,
                        fontWeight: '500',
                        padding: 15,
                        textAlign: 'center'
                    }}>Total Successful verfication</h4>

                    <span style={{
                        fontSize: 30,
                        fontWeight: '700',
                        textAlign: 'center',
                        color: 'green'
                    }}>
                        {totalNoOfSuccessFullVerifications}
                    </span>

                </div>

                <div style={{
                    height: 150,
                    flex: 1,
                    borderRadius: 10,
                    textAlign: 'center',
                    backgroundColor: '#ff676a83'
                }} className="fl-cont">
                    <h4 style={{
                        fontSize: 15,
                        fontWeight: '500',
                        padding: 15,
                        textAlign: 'center'
                    }}>Total Failed verfication</h4>

                    <span style={{
                        fontSize: 30,
                        fontWeight: '700',
                        textAlign: 'center',
                        color: 'red'
                    }}>
                        {totalNoOfFailedVerifications}
                    </span>

                </div>

            </div>


            {/* ledger process */}

            <h3 style={{
                fontSize: 18,
                fontWeight: '500',
                padding: 20
            }}> Ledger Process Analytics </h3>

            <select onChange={(e) => {
                var t_logs = backupLog.filter((item) => item.TYPE === "process");
                if (e.target.value === 'all') {
                    const t_log_success = t_logs.filter((item) => item.ACTION === 'approved');
                    const t_log_failed = t_logs.filter((item) => item.ACTION === 'rejected');
                    setTotalSuccessProcess(t_log_success.length);
                    setTotalFailedProcess(t_log_failed.length);
                    setTotalProcess(t_log_success.length + t_log_failed.length);
                }
                else if (e.target.value === '24-hours') {
                    const filtered_for_24_hours = t_logs.filter((item) => {
                        var date = item.createdAt;
                        var n_date = new Date(date);
                        var c_date = new Date();
                        return n_date.getDate() === c_date.getDate();
                    });
                    const t_log_success = filtered_for_24_hours.filter((item) => item.ACTION === 'approved');
                    const t_log_failed = filtered_for_24_hours.filter((item) => item.ACTION === 'rejected');
                    setTotalSuccessProcess(t_log_success.length);
                    setTotalFailedProcess(t_log_failed.length);
                    setTotalProcess(t_log_success.length + t_log_failed.length);

                }
                else if (e.target.value === 'week') {
                    const filtered_for_month = t_logs.filter((item) => {
                        var date = item.createdAt;
                        var n_date = new Date(date);
                        var c_date = new Date();
                        return n_date.getMonth() === c_date.getMonth();
                    });
                    const t_log_success = filtered_for_month.filter((item) => item.ACTION === 'approved');
                    const t_log_failed = filtered_for_month.filter((item) => item.ACTION === 'rejected');
                    setTotalSuccessProcess(t_log_success.length);
                    setTotalFailedProcess(t_log_failed.length);
                    setTotalProcess(t_log_success.length + t_log_failed.length);
                }
                else if (e.target.value === 'month') {
                    const filtered_for_month = t_logs.filter((item) => {
                        var date = item.createdAt;
                        var n_date = new Date(date);
                        var c_date = new Date();
                        return n_date.getMonth() === c_date.getMonth();
                    });
                    const t_log_success = filtered_for_month.filter((item) => item.ACTION === 'approved');
                    const t_log_failed = filtered_for_month.filter((item) => item.ACTION === 'rejected');
                    setTotalSuccessProcess(t_log_success.length);
                    setTotalFailedProcess(t_log_failed.length);
                    setTotalProcess(t_log_success.length + t_log_failed.length);
                }
                else if (e.target.value === 'year') {
                    const filtered_for_year = t_logs.filter((item) => {
                        var date = item.createdAt;
                        var n_date = new Date(date);
                        var c_date = new Date();
                        return n_date.getFullYear() === c_date.getFullYear();
                    });
                    const t_log_success = filtered_for_year.filter((item) => item.ACTION === 'approved');
                    const t_log_failed = filtered_for_year.filter((item) => item.ACTION === 'rejected');
                    setTotalSuccessProcess(t_log_success.length);
                    setTotalFailedProcess(t_log_failed.length);
                    setTotalProcess(t_log_success.length + t_log_failed.length);
                }
            }} style={{
                margin: '0 20px',
                padding: '10px 26px'
            }} name="analy_date" id="analy_date">
                <option value="all">All Time</option>
                <option value="24-hours">Past 24 Hour</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
            </select>

            <div style={{
                padding: 20,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 20
            }}>

                <div style={{
                    height: 150,
                    borderRadius: 10,
                    textAlign: 'center',
                    flex: 1,
                    backgroundColor: '#6790ff3a'
                }} className="fl-cont">
                    <h4 style={{
                        fontSize: 15,
                        fontWeight: '500',
                        padding: 15,
                        textAlign: 'center'
                    }}>Total Ledger Process done</h4>

                    <span style={{
                        fontSize: 30,
                        fontWeight: '700',
                        textAlign: 'center',
                        color: 'blue'
                    }}>
                        {totalProcess}
                    </span>

                </div>


                <div style={{
                    height: 150,
                    borderRadius: 10,
                    textAlign: 'center',
                    flex: 1,
                    backgroundColor: '#76ffaf9a'
                }} className="fl-cont">
                    <h4 style={{
                        fontSize: 15,
                        fontWeight: '500',
                        padding: 15,
                        textAlign: 'center'
                    }}>Total Approved Process</h4>

                    <span style={{
                        fontSize: 30,
                        fontWeight: '700',
                        textAlign: 'center',
                        color: 'green'
                    }}>
                        {totalSuccessProcess}
                    </span>

                </div>

                <div style={{
                    height: 150,
                    flex: 1,
                    borderRadius: 10,
                    textAlign: 'center',
                    backgroundColor: '#ff676a83'
                }} className="fl-cont">
                    <h4 style={{
                        fontSize: 15,
                        fontWeight: '500',
                        padding: 15,
                        textAlign: 'center'
                    }}>Total Rejected Process</h4>

                    <span style={{
                        fontSize: 30,
                        fontWeight: '700',
                        textAlign: 'center',
                        color: 'red'
                    }}>
                        {totalFailedProcess}
                    </span>

                </div>

            </div>


            
        </div>
    );
}
