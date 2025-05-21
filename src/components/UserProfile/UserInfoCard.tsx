import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserInfoCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setUser(data.user);
    } catch (error) {
      toast.error("Gagal memuat data profil");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Gagal memuat data</div>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informasi Pribadi
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nama Lengkap
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.name || '-'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email || '-'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nomor HP
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.phone || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}