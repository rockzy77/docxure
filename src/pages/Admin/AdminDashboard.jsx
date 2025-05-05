import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import { getAllUsersDB, getUserByTokenDB } from "../../services/authAPI";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../provider/appProvider";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { createProcessDB, getAllProcessDB, updateProcessDB } from "../../services/verifyAPI";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { MdEdit, MdDelete, MdRestore } from "react-icons/md";
import { getAllDocumentsDB, restoreDocumentDB, revokeDocumentDB } from '../../services/issuerAPI';
import { RiProhibitedLine } from "react-icons/ri";
import { EditProfile } from './component/EditProfile';
import { deleteUserDB } from '../../services/userAPI';



export const AdminDashboard = () => {


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    const appData = useContext(AppContext);
    const [showIssVer, setShowIssVer] = useState(true);
    const [showUsrMg, setShowUsrMg] = useState(true);
    const [showDocMg, setShowDocMg] = useState(true);
    const [ledgerProcess, setLedgerProcess] = useState([]);
    const [ledgers, setLedgers] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [profileToEdit, setProfileToEdit] = useState(null);

    const process_columns = [
        { id: 'LPID', label: 'LPID', minWidth: 50 },
        { id: 'LID', label: 'LID', minWidth: 50 },
        {
            id: 'DOCURL',
            label: 'DOCURL',
            minWidth: 170,
            align: 'right',
            customRender: (row) => {
                return <a href={row.DOCURL} target='_blank'>{row.DOCURL}</a>
            }
        },
        {
            id: 'STATUS',
            label: 'STATUS',
            minWidth: 170,
            align: 'right',
        },
        {
            id: '',
            label: 'ACTION',
            minWidth: 170,
            align: 'right',
            customRender: (row) => {
                return <div style={{
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'flex-end'
                }}>
                    {
                        row.STATUS === 'pending' ? <>
                        <AiOutlineCheckCircle onClick={async() => {
                        var res = await updateProcessDB(row.LPID, {
                            LID: row.LID,
                            STATUS: 'approved'
                        });
                        if (res.success) {
                            alert('Process approved successfully');
                            getLedgerProcess();
                            getAllLedgers();
                        }
                        else {
                            alert(res.message);
                        }

                    }} style={{
                        fontSize: 20,
                        cursor: 'pointer',
                        color: 'green'
                    }} />
                    <AiOutlineCloseCircle onClick={async() => {
                        var res = await updateProcessDB(row.LPID, {
                            LID: row.LID,
                            STATUS: 'rejected'
                        });
                        if (res.success) {
                            alert('Process rejected successfully');
                            getLedgerProcess();
                            getAllLedgers();
                        }
                        else {
                            alert(res.message);
                        }
                    }} style={{
                        fontSize: 20,
                        cursor: 'pointer',
                        color: 'red'
                    }} /></> : ''
                    }
                </div>
            }
        },
    ];
    
    
    const user_columns = [
        { id: 'LID', label: 'LID', minWidth: 50 },
        { id: 'LNAME', label: 'LNAME', minWidth: 170 },
        { id: 'LEMAIL', label: 'LEMAIL', minWidth: 170 },
        { id: 'LPHONE', label: 'LPHONE', minWidth: 100 },
        { id: 'LTYPE', label: 'LTYPE', minWidth: 100 },
        {
            id: 'FIRST_LOGIN',
            label: 'FIRST_LOGIN',
            minWidth: 50,
            customRender: (row) => {
                return <div style={{
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'center'
                }}>
                    <span>{row.FIRST_LOGIN ? 'YES' : 'NO'}</span>
                </div>
            }
        },
        {
            id: 'IS_ACTIVE',
            label: 'IS_ACTIVE',
            minWidth: 50,
            customRender: (row) => {
                return <div style={{
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'center'
                }}>
                    <span>{row.IS_ACTIVE ? 'YES' : 'NO'}</span>
                </div>
            }
        },
        {
            id: '',
            label: 'ACTION',
            minWidth: 100,
            align: 'right',
            customRender: (row) => {
                return <div style={{
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'flex-end'
                }}>
                    <MdEdit onClick={() => {
                        setProfileToEdit(row);
                        setShowProfile(true);
                    }} style={{
                        fontSize: 20,
                        cursor: 'pointer',
                        color: 'blue'
                    }} />
                    <MdDelete onClick={async() => {
                        var res = await deleteUserDB(row.LID);
                        var confirm = window.confirm('Are you sure you want to delete this user?');
                        if (!confirm) {
                            return
                        }
                        if (res.success) {
                            alert('User deleted successfully');
                            getAllLedgers();
                        }
                        else {
                            alert(res.message);
                        }
                    }} style={{
                        fontSize: 20,
                        cursor: 'pointer',
                        color: 'red'
                    }} />
                </div>
            }
        },
    ];
    
    const document_columns = [
        { id: 'DID', label: 'DID', minWidth: 50 },
        { id: 'LID', label: 'LID', minWidth: 50 },
        { id: 'DNAME', label: 'DNAME', minWidth: 50 },
        { id: 'ISS_NAME', label: 'ISS_NAME', minWidth: 50 },
        { id: 'ISS_EMAIL', label: 'ISS_EMAIL', minWidth: 50 },
        { id: 'REC_NAME', label: 'REC_NAME', minWidth: 50 },
        { id: 'REC_EMAIL', label: 'REC_EMAIL', minWidth: 50 },
        { id: 'DURL', label: 'DURL', minWidth: 50, customRender: (row) => {
            return <a href={row.DURL} target='_blank'>{row.DURL}</a>
        }},
        {
            id: 'IS_ACTIVE', label: 'IS_ACTIVE', minWidth: 50, customRender: (row) => {
                return <div style={{
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'center'
                }}>
                    <span>{row.IS_ACTIVE ? 'YES' : 'NO'}</span>
                </div>
            }
        },
        {
            id: '',
            label: 'ACTION',
            minWidth: 100,
            align: 'right',
            customRender: (row) => {
                return <div style={{
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'flex-end'
                }}>
                    {
                        !row.IS_ACTIVE ? <MdRestore onClick={async() => {
                            var confirm = window.confirm('Are you sure you want to restore this document?');
                            if (!confirm) {
                                return
                            }
                            var res = await restoreDocumentDB(row.DID);
                            if (res.success) {
                                alert('Document restored successfully');
                                getAllDocuments();
                            }
                            else {
                                alert(res.message);
                            }
                        }} style={{
                            fontSize: 20,
                            cursor: 'pointer',
                            color: 'green'
                        }} /> :<RiProhibitedLine onClick={async() => {
                            var confirm = window.confirm('Are you sure you want to revoke this document?');
                            if (!confirm) {
                                return
                            }
                            var res = await revokeDocumentDB(row.DID);
                            if (res.success) {
                                alert('Document revoked successfully');
                                getAllDocuments();
                            }
                            else {
                                alert(res.message);
                            }
                        }} style={{
                            fontSize: 20,
                            cursor: 'pointer',
                            color: 'red'
                        }} />
                    }
                    
                </div>
            }
        }
    ];

    const getLedgerProcess = async () => {
        var res = await getAllProcessDB();
        if (res.success) {
            var process_reverse = res.processes.reverse();
            setLedgerProcess(process_reverse);
        }
        else {
            console.log(res.message);
        }
    };

    const getAllLedgers = async () => {
        var res = await getAllUsersDB();
        if (res.success) {
            setLedgers(res.users);
        }
        else {
            console.log(res.message);
        }
    }

    const getAllDocuments = async () => {
        var res = await getAllDocumentsDB();
        if (res.success) {
            setDocuments(res.documents);
        }
        else {
            console.log(res.message);
        }
    }

    useEffect(() => {
        getLedgerProcess();
        getAllLedgers();
        getAllDocuments();
    }, []);

    const closePOP = () => {
        setShowProfile(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
        }}>
             {showProfile ? <div style={{
                        position: 'fixed',
                        zIndex: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        width: '100vw',
                        top: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}>
                        <EditProfile closePOP={closePOP} profile={profileToEdit} />
                    </div> : ''}
            {/* Issuer Verificaiton */}
            <div>
                <h3 style={{
                    fontSize: 18,
                    fontWeight: '500',
                    padding: 20
                }}>Issuer Verification {
                        showIssVer ? <IoIosArrowUp onClick={() => setShowIssVer(false)} style={{
                            position: 'relative',
                            top: 3,
                            fontSize: 20,
                            cursor: 'pointer'
                        }} /> : <IoIosArrowDown onClick={() => setShowIssVer(true)} style={{
                            position: 'relative',
                            top: 3,
                            fontSize: 20,
                            cursor: 'pointer'
                        }} />
                    }
                </h3>
                {
                    showIssVer ? <div style={{
                        padding: 20,
                    }} className="iss-ver-cont">
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {process_columns.map((column) => (
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
                                        {ledgerProcess
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, rowIndex) => (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                                    {process_columns.map((column) => {
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
                                count={ledgerProcess.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div> : ''
                }
            </div>

            {/* User Management */}
            <div>
                <h3 style={{
                    fontSize: 18,
                    fontWeight: '500',
                    padding: 20
                }}>User Management {
                        showUsrMg ? <IoIosArrowUp onClick={() => setShowUsrMg(false)} style={{
                            position: 'relative',
                            top: 3,
                            fontSize: 20,
                            cursor: 'pointer'
                        }} /> : <IoIosArrowDown onClick={() => setShowUsrMg(true)} style={{
                            position: 'relative',
                            top: 3,
                            fontSize: 20,
                            cursor: 'pointer'
                        }} />
                    }</h3>
                {
                    showUsrMg ? <div style={{
                        padding: 20,
                    }} className="usr-mg-cont">
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {user_columns.map((column) => (
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
                                        {ledgers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, rowIndex) => (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                                    {user_columns.map((column) => {
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
                                count={ledgers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div> : ''
                }
            </div>

            {/* Document Management */}
            <div>
                <h3 style={{
                    fontSize: 18,
                    fontWeight: '500',
                    padding: 20
                }}>Document Management {
                        showDocMg ? <IoIosArrowUp onClick={() => setShowDocMg(false)} style={{
                            position: 'relative',
                            top: 3,
                            fontSize: 20,
                            cursor: 'pointer'
                        }} /> : <IoIosArrowDown onClick={() => setShowDocMg(true)} style={{
                            position: 'relative',
                            top: 3,
                            fontSize: 20,
                            cursor: 'pointer'
                        }} />
                    }</h3>
                {
                    showDocMg ? <div style={{
                        padding: 20,
                    }} className="doc-mg-cont">
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {document_columns.map((column) => (
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
                                        {documents
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, rowIndex) => (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                                    {document_columns.map((column) => {
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
                                count={documents.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </div> : ''
                }
            </div>

        </div>
    );
}
