import styles from './Users.module.css';
import { useState, useEffect } from 'react';
import { FiSearch, FiUsers } from "react-icons/fi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useUsersApi } from '../../../api/usersApi';
import { useUserContext } from '../../../contexts/UserContext';
import { useAdminApi } from '../../../api/adminApi';

const Users = () => {

  const { user: currentUser } = useUserContext();
  const { getAll, updateRole } = useUsersApi();

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [statsData, setStatsData] = useState(null);

  const { getUsersDetails } = useAdminApi();

  const [loadingId, setLoadingId] = useState(null);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);


  useEffect(() => {
    loadData();
  }, [debouncedSearch, role, page]);


  const loadStatsData = async () => {
    try {
      const res = await getUsersDetails();

      setStatsData(res);

    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    loadStatsData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getAll(debouncedSearch, role, page);

      setUsers(res.data);
      setTotal(res.total);


    } catch (err) {
      console.error(err.message);
    }
  };

  const getPages = () => {
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (page > 2) pages.push('...');

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (page < totalPages - 1) pages.push('...');

    pages.push(totalPages);

    return [...new Set(pages)];
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoadingId(userId);
      await updateRole(userId, newRole);
      await loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.usersContainer}>

      <div className={styles.sectionTitle}>
        <h1>Users Management</h1>
      </div>

      <div className={styles.sectionContent}>

        <p>Manage customer accounts and permissions</p>

        <div className={styles.stats}>
          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>Total Users</p>
              <h3>{statsData?.totalUsers}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.usersIcon}`}>
              <FiUsers />
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.statsInfo}>
              <p>New This Month</p>
              <h3>{statsData?.newThisMonth}</h3>
            </div>
            <div className={`${styles.statsIcon} ${styles.newUsersIcon}`}>
              <FaArrowTrendUp />
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className={styles.toolbar}>

          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
            />
            <button className={styles.searchBtn}>
              <FiSearch />
            </button>
          </div>

          <select
            className={styles.filter}
            value={role ?? ''}
            onChange={(e) => {
              setRole(e.target.value || null);
              setPage(1);
            }}
          >
            <option value="">All roles</option>
            <option value="0">User</option>
            <option value="1">Admin</option>
            <option value="2">Owner</option>
          </select>

        </div>

        {/* TABLE */}
        <div className={styles.tableWrapper}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map(u => (
                <tr key={u.id}>

                  <td>
                    <div>
                      <p className={styles.userName}>
                        {u.firstName} {u.lastName}
                      </p>
                      <p className={styles.userEmail}>
                        {u.email}
                      </p>
                    </div>
                  </td>

                  <td>
                    <span className={`${styles.status} ${u.role === 2 ? styles.owner :
                      u.role === 1 ? styles.admin :
                        styles.user
                      }`}>
                      {u.role === 2 ? 'Owner' :
                        u.role === 1 ? 'Admin' : 'User'}
                    </span>
                  </td>

                  <td>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td>{u.ordersCount}</td>

                  <td>
                    €{Number(u.totalSpent).toFixed(2)}
                  </td>

                  <td>
                    {u.lastOrder
                      ? new Date(u.lastOrder).toLocaleDateString()
                      : '-'}
                  </td>

                  <td>
                    <div className={styles.actions}>

                      <button className={styles.view}>
                        View
                      </button>

                      {/* OWNER */}
                      {currentUser?.role === 2 && u.id !== currentUser.id && (
                        <>
                          {u.role !== 1 && (
                            <button
                              className={styles.promote}
                              disabled={loadingId === u.id}
                              onClick={() => handleRoleChange(u.id, 1)}
                            >
                              Promote
                            </button>
                          )}

                          {u.role !== 0 && (
                            <button
                              className={styles.demote}
                              disabled={loadingId === u.id}
                              onClick={() => handleRoleChange(u.id, 0)}
                            >
                              Demote
                            </button>
                          )}
                        </>
                      )}

                      {/* ADMIN */}
                      {currentUser?.role === 1 && u.role === 0 && (
                        <button
                          className={styles.promote}
                          disabled={loadingId === u.id}
                          onClick={() => handleRoleChange(u.id, 1)}
                        >
                          Promote
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <span className={styles.pgInfo}>
              Showing {start}–{end} of {total} users
            </span>

            <div className={styles.pgBtns}>
              <button
                className={styles.pgBtn}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ‹
              </button>

              {getPages().map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className={styles.pgDots}>...</span>
                ) : (
                  <button
                    key={p}
                    className={`${styles.pgBtn} ${page === p ? styles.pgActive : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className={styles.pgBtn}
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                ›
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Users;
