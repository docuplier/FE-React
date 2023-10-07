export const csvData = {
  getHeadingData: function (columns) {
    let headingData = [];

    columns?.map((item) => {
      let heading = item.title;
      return headingData.push(heading);
    });
    return headingData;
  },

  getStudentTableData: function (studentData) {
    const students = [];
    const studentsArray = studentData?.users?.results?.flat();
    studentsArray?.map((student) =>
      students.push([
        `${student?.firstname ?? '--'} ${student?.lastname ?? '--'}`,
        student?.matricNumber ?? '--',
        student?.faculty?.name ?? '--',
        student?.department?.name ?? '--',
        student?.level?.name ?? '--',
        student?.isActive || 'False',
      ]),
    );
    return students;
  },

  getAdminstratorTableData: function (adminData) {
    const administrators = [];
    const adminArray = adminData?.users?.results?.flat();
    adminArray?.map((admin) =>
      administrators.push([
        `${admin?.firstname ?? '--'} ${admin?.lastname ?? '--'}`,
        admin?.email ?? '--',
        `${admin.isActive ? 'ENABLED' : 'DISABLED'}`,
      ]),
    );
    return administrators;
  },

  getLecturerTableData: function (lecturerData) {
    const lecturers = [];
    const lecturerArray = lecturerData?.users?.results?.flat();
    lecturerArray?.map((lecturer) =>
      lecturers.push([
        `${lecturer?.firstname ?? '--'} ${lecturer?.lastname ?? '--'}`,
        lecturer?.email ?? '--',
        lecturer?.gender ?? '-',
        lecturer?.department?.name ?? '--',
        `${lecturer.isActive ? 'ENABLED' : 'DISABLED'}`,
      ]),
    );
    return lecturers;
  },

  getCustomUserTableData: function (customUserData) {
    const customUsers = [];
    const customUserArray = customUserData?.users?.results?.flat();
    customUserArray?.map((user) =>
      customUsers.push([
        `${user?.firstname ?? '--'} ${user?.lastname ?? '--'}`,
        user?.email,
        user?.gender ?? '-',
        `${user.isActive ? 'ENABLED' : 'DISABLED'}`,
      ]),
    );
    return customUsers;
  },

  getMigrationTableData: function (migrationData) {
    const migrations = [];
    const migrationArray = migrationData?.existingUsers?.results?.flat();
    migrationArray?.map((user) =>
      migrations.push([
        `${user?.firstname ?? '--'} ${user?.lastname ?? '--'}`,
        user?.matricNumber ?? '--',
        user?.department?.name ?? '--',
        user?.faculty?.name ?? '--',
      ]),
    );
    return migrations;
  },
};
