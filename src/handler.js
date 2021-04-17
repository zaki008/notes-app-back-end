const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title = 'catatan', tags, body } = request.payload;

  /* nanoid merupakan library agar nilai id bersifat unik
  parameter nya beruapa number yang merupakan ukuran dari stringnya */
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updateAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updateAt,
  };

  notes.push(newNote);

  /* untuk mengetahui newNote sudah maasuk ke array note\
  filter(untuk melakukan proses penyaringan (filtering) terhadap nilai array yang ada.)
  */
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'Success',
      message: 'Catatan Berhasil di Tambahkan',
      data: {
        noteId: id,
      },
    });
    response.code = 200;
    return response;
  }
  const response = h.response({
    status: 'Failed',
    message: 'Catatan Gagal di Tambahkan',
  });
  response.code(500);
  return response;
};

const getNotesHandler = () => ({
  status: 'Success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  /* Setelah mendapatkan nilai id, dapatkan objek note dengan id tersebut dari objek array notes.
  Manfaatkan method array filter() untuk mendapatkan objeknya. */
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'Success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'Fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updateAt = new Date().toISOString();

  /* dapatkan dulu index array pada objek catatan sesuai id yang ditentukan. Untuk melakukannya,
  gunakanlah method array findIndex(). */
  const index = notes.findIndex((note) => note.id === id);

  // bila tidak ditemukan, maka index bernilai -1
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };

    const response = h.response({
      status: 'Success',
      message: 'Catatan Berhasil di Perbarui',
    });
    response.code = 200;
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    // untuk menghapus data pada array berdasarkan index, gunakan method array splice().
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
