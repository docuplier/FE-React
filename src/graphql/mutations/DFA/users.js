import { gql } from '@apollo/client';
import { CORE_EXISTING_USER_FULL_FIELDS, CORE_USER_FIELDS } from 'graphql/DFAfragments';

export const UPLOAD_USERS = gql`
  mutation uploadUser($roles: [SignupRoleEnum!], $file: Upload) {
    uploadUser(userUploadDetails: { roles: $roles, file: $file }) {
      ok
      errors {
        messages
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation CreateDfaUser(
    $firstname: String
    $lastname: String
    $phone: String
    $gender: String
    $email: String
    $age: Int!
    $maritalStatus: DfaUserMaritalStatusEnumCreate!
    $stateOfOrigin: String!
    $currentState: String!
    $residentialArea: DfaUserResidentialAreaEnumCreate!
    $currentlyDoing: DfaUserCurrentlyDoingEnumCreate!
    $employment: DfaUserEmployementCreate!
    $education: DfaUserEducationEnumCreate!
    $isDisabled: Boolean
    $isHearingImpaired: Boolean
    $isVisionImpaired: Boolean
    $isMovementImpaired: Boolean
    $hasAlbinism: Boolean
    $hasOthers: Boolean
    $monthlyIncome: DfaUserMonthlyIncomeEnumCreate!
    $extentOfDigitalSkills: DfaUserExtentOfDigitalSkillsEnumCreate!
    $computerAbility: $DfaUserComputerAbilityEnumCreate!
    $digitalSkillsTrainingJourney: 
    $digitalParticipation: Boolean
    $learningTrack: DfaUserLearningTrackEnumCreate!
    $digitalSkills: DfaUserDigitalSkillsEnumCreate!
    $reasonForDigitalSkills: Skills!
    $hasLaptop: Boolean
    $hasPhone: Boolean
    $hasInternet: Boolean
    $hasTime: Boolean
    $platform: DfaUserPlatformEnumCreate!
    $category: DfaUserCategoryEnumCreate!
    $schoolName: String
    $schoolCategory: DfaUserSchoolCategoryEnumCreate
    $schoolType: DfaUserSchoolTypeEnumCreate
    $genderIntentional: DfaUserGenderIntentionalEnumCreate
    $numberOfSubjects: Int
    $subjectCategory: DfaUserSubjectCategoryEnumCreate
    $subjectName: String
    $certification: String
  ) {
    createDfaUser(
      newDfauser: {
        firstname: $firstname
        lastname: $lastname
        phone: $phone
        gender: $gender
        email: $email
        age: $age
        maritalStatus: $maritalStatus
        stateOfOrigin: $stateOfOrigin
        currentState: $currentState
        residentialArea: $residentialArea
        currentlyDoing: $currentlyDoing
        employment: $employment
        education: $education
        isDisabled: $isDisabled
        isHearingImpaired: $isHearingImpaired
        isVisionImpaired: $isVisionImpaired 
        isMovementImpaired: $isMovementImpaired 
        hasAlbinism: $hasAlbinism 
        hasOthers: $hasOthers 
        monthlyIncome: $monthlyIncome 
        extentOfDigitalSkills: $extentOfDigitalSkills 
        computerAbility: $computerAbility 
        digitalSkillsTrainingJourney: $digitalSkillsTrainingJourney 
        digitalParticipation: $digitalParticipation 
        learningTrack: $learningTrack 
        digitalSkills: $digitalSkills 
        reasonForDigitalSkills: $reasonForDigitalSkills 
        hasLaptop: $hasLaptop 
        hasPhone: $hasPhone 
        hasInternet: $hasInternet 
        hasTime: $hasTime 
        platform: $platform 
        category: $category 
        schoolName: $schoolName 
        schoolCategory: $schoolCategory 
        schoolType: $schoolType 
        genderIntentional: $genderIntentional 
        numberOfSubjects: $numberOfSubjects 
        subjectCategory: $subjectCategory 
        subjectName: $subjectName 
        certification: $certification
      }
    )  {
      ok
      errors {
        messages
      }
      dfauser {
        id
        firstname
        lastname
        email
      }
    }
  }
`;
export const UPDATE_USER = gql`
  ${CORE_USER_FIELDS}
  mutation updateUser($newUser: UserUpdateGenericType!, $id: ID!, $image: Upload) {
    updateUser(newUser: $newUser, id: $id, image: $image) {
      user {
        ...UserPart
      }
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const UPDATE_EXISTING_USER = gql`
  mutation updateExistingUser(
    $existingUserEmail: String
    $existingUserId: UUID!
    $existingUserPhone: String
  ) {
    updateExistingUser(
      existingUserEmail: $existingUserEmail
      existingUserId: $existingUserId
      existingUserPhone: $existingUserPhone
    ) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const UPDATE_USER_INFORMATION = gql`
  mutation updateUserInformation($newUserinformation: UserInformationUpdateGenericType!, $id: ID!) {
    updateUserInformation(newUserinformation: $newUserinformation, id: $id) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const CREATE_USER_INFORMATION = gql`
  mutation createUserInformation($newUserinformation: UserInformationCreateGenericType!) {
    createUserInformation(newUserinformation: $newUserinformation) {
      ok
      userinformation {
        id
        about
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const DEACTIVATE_USERS = gql`
  mutation deactiveUsers($userIds: [UUID]) {
    deactivateUsers(userIds: $userIds) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
        field
      }
    }
  }
`;

export const ACTIVATE_USERS = gql`
  mutation activateUsers($userIds: [UUID]) {
    activateUsers(userIds: $userIds) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
        field
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      ok
      user {
        id
      }
      errors {
        messages
        field
      }
    }
  }
`;

export const DELETE_MULTI_USER = gql`
  mutation deleteUsers($userIds: [UUID]!) {
    deleteUsers(userIds: $userIds) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
        field
      }
    }
  }
`;

export const RESEND_EMAIL = gql`
  mutation resendVerification($userIds: [UUID]!) {
    resendVerification(userIds: $userIds) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
        field
      }
    }
  }
`;
