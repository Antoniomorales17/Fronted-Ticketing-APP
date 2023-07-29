import React, { useMemo, useState } from 'react';
import { useTable, useGlobalFilter, useFilters, useSortBy } from 'react-table';
import { FaSort, FaSortUp, FaSortDown, FaPlus } from 'react-icons/fa';
import styles from './TicketList.module.css';

const TicketList = ({ tickets, createNewTicket }) => {
  const data = useMemo(() => tickets, [tickets]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    // Define the initial values for the new ticket form fields here
  });

  const columns = useMemo(
    () => [
      {
        Header: 'Número',
        accessor: 'ticket_number',
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Asunto',
        accessor: 'subject',
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Estado',
        accessor: 'status',
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Creado Por',
        accessor: 'created_by',
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Cliente',
        accessor: 'client.name',
        canFilter: true,
        sortType: 'basic',
      },
      // Add more columns as needed
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        // Define initial state as needed, e.g., hiddenColumns: ['id']
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  // Function to open and close the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to handle changes in the modal form
  const handleChange = e => {
    const { name, value } = e.target;
    setNewTicketData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle the submission of the modal form
  const handleCreateTicket = async e => {
    e.preventDefault();
    const success = await createNewTicket(newTicketData);
    if (success) {
      toggleModal(); // Close the modal after successfully creating the ticket
    }
  };

  return (
    <div className={styles.container}>
      <h2>Lista de Tickets</h2>
      <div className={styles.searchContainer}>
        <i className={`fa fa-search ${styles.searchIcon}`} aria-hidden="true"></i>
        <input
          type="text"
          value={globalFilter || ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Buscar tickets..."
          className={styles.searchInput}
        />
      </div>

      <table {...getTableProps()} className={styles.ticketTable}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <FaSortDown className={`${styles.sortIndicator} ${styles.sortDesc}`} />
                    ) : (
                      <FaSortUp className={`${styles.sortIndicator} ${styles.sortAsc}`} />
                    )
                  ) : (
                    <FaSort className={styles.sortIndicator} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={styles.ticketRow}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add button or any other UI element to open the modal */}
      <button onClick={toggleModal} className={styles.addButton}>
        <FaPlus />
        Agregar Ticket
      </button>

      {/* Render the modal */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {/* Add form or any other UI elements for creating a new ticket */}
            <h2>Nuevo Ticket</h2>
            <form onSubmit={handleCreateTicket}>
              {/* Add form fields and form handling functions here */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
