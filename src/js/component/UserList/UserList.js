import React, { useMemo, useState } from 'react';
import { useTable, useGlobalFilter, useFilters, useSortBy } from 'react-table';
import { FaSort, FaSortUp, FaSortDown, FaPlus } from 'react-icons/fa';
import styles from './UserList.module.css';

const UserList = ({ users, createUser }) => {
  const data = useMemo(() => users, [users]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'directivo',
  });

  const columns = useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'name',
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Correo',
        accessor: 'email',
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Rol',
        accessor: 'role',
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Departamentos',
        accessor: row => row.departments.map(dep => dep.name_department).join(', '),
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Cliente',
        accessor: 'client?.name',
        canFilter: true,
        sortType: 'basic',
      },
      {
        Header: 'Tickets',
        accessor: 'tickets.length',
        canFilter: true,
        sortType: 'basic',
      },
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
        hiddenColumns: ['id'],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  // Función para abrir y cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Función para manejar los cambios en el formulario del modal
  const handleChange = e => {
    const { name, value } = e.target;
    setNewUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar el envío del formulario del modal
  const handleCreateUser = async e => {
    e.preventDefault();
    const success = await createUser(newUserData);
    if (success) {
      toggleModal(); // Cerrar el modal después de crear el usuario exitosamente
    }
  };

  return (
    <div className={styles.container}>
      <h2>Lista de Usuarios</h2>
      <div className={styles.searchContainer}>
        <i className={`fa fa-search ${styles.searchIcon}`} aria-hidden="true"></i>
        <input
          type="text"
          value={globalFilter || ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Buscar usuarios..."
          className={styles.searchInput}
        />
      </div>

      <table {...getTableProps()} className={styles.userTable}>
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
              <tr {...row.getRowProps()} className={styles.userRow}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={toggleModal} className={styles.addButton}>
        <FaPlus />
        Agregar Usuario
      </button>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Nuevo Usuario</h2>
            <form onSubmit={handleCreateUser}>
              <div className={styles.formGroup}>
                <label>Nombre:</label>
                <input type="text" name="name" value={newUserData.name} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Correo:</label>
                <input type="email" name="email" value={newUserData.email} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Rol:</label>
                <select name="role" value={newUserData.role} onChange={handleChange}>
                  <option value="directivo">Directivo</option>
                  <option value="administrador">Administrador</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>
              <div className={styles.modalButtons}>
              <button type="submit">Guardar</button>
                <button type="button" onClick={toggleModal} className={styles.cancelButton}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
