import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setUser(data.user);
      setForm({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
      });
    } catch (error) {
      toast.error("Gagal memuat data profil");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    if (photo) formData.append('photo', photo);
    formData.append('_method', 'PUT');

    try {
      const { data } = await axios.post('http://localhost:8000/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setUser(data.user);
      toast.success("Profil berhasil diupdate!");
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img 
                 src={user.photo 
                    ? `http://localhost:8000${user.photo}` 
                    : "/images/user/owner.jpg"
                  }
                alt={user.name} 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit Profil
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profil
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update informasi pribadi Anda
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Nomor HP</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="photo">Foto Profil</Label>
                <Input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                >
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}