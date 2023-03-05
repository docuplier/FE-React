import DocumentLayout from "components/Layout/DocumentLayout/DocumentLayout";
import Layout from "components/Layout/Layout";
import PageSpinner from "components/pageSpinner/PageSpinner";
import { CERTIFICATE_STEPS, DOCUMENT_TABS } from "constants/appConstants";
import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import routes, { paths } from "Routes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.main.map(({ component: Component, path }) => (
          <Route
            path={path}
            key={path}
            element={
              <Suspense fallback={<PageSpinner />}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route
        path={routes.certificates.path}
        element={
          <DocumentLayout
            activeTab={DOCUMENT_TABS[0].name}
            tabItems={DOCUMENT_TABS}
            steps={CERTIFICATE_STEPS}
          />
        }
      >
        <Route index element={<Navigate to={paths.CERTIFICATES_UPLOAD} />} />
        {routes.certificates.children.map(({ component: Component, path }) => (
          <Route
            path={path}
            key={path}
            element={
              <Suspense fallback={<PageSpinner height="50vh" width="50vw" />}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route
        path={routes.badges.path}
        element={
          <DocumentLayout
            activeTab={DOCUMENT_TABS[1].name}
            tabItems={DOCUMENT_TABS}
            steps={CERTIFICATE_STEPS}
          />
        }
      >
        <Route index element={<Navigate to={paths.BADGES_UPLOAD} />} />
        {routes.badges.children.map(({ component: Component, path }) => (
          <Route
            path={path}
            key={path}
            element={
              <Suspense fallback={<PageSpinner height="50vh" width="50vw" />}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route
        path={routes.tags.path}
        element={
          <DocumentLayout
            activeTab={DOCUMENT_TABS[2].name}
            tabItems={DOCUMENT_TABS}
            steps={CERTIFICATE_STEPS}
          />
        }
      >
        <Route index element={<Navigate to={paths.TAGS_UPLOAD} />} />
        {routes.tags.children.map(({ component: Component, path }) => (
          <Route
            path={path}
            key={path}
            element={
              <Suspense fallback={<PageSpinner height="50vh" width="50vw" />}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route
        path={routes.invitations.path}
        element={
          <DocumentLayout
            activeTab={DOCUMENT_TABS[3].name}
            tabItems={DOCUMENT_TABS}
            steps={CERTIFICATE_STEPS}
          />
        }
      >
        <Route index element={<Navigate to={paths.INVITATIONS_UPLOAD} />} />
        {routes.invitations.children.map(({ component: Component, path }) => (
          <Route
            path={path}
            key={path}
            element={
              <Suspense fallback={<PageSpinner height="50vh" width="50vw" />}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Route>
    </Routes>
  );
}

export default App;

/* 
{"status":"success","message":"Document created successfully.","data":{"_id":"63b0029fc0768b25e2de9faf","idempotencyKey":"63959ebb849d5b9b485e419a","orgName":"Olivenelson","emailText":"Please find the attached email.","image":{"src":"https://res.cloudinary.com/dmgelvnbk/image/upload/v1672479391/fcw9vpxu1fceft0xbv0j.png","width":555,"height":393},"product":"63959ebb849d5b9b485e419a","owner":"63b0028dc0768b25e2de9fa5","fields":[{"fieldName":"name","fontFamily":"'Nunito', sans-serif;","width":{"$numberDecimal":"555"},"height":{"$numberDecimal":"400.20001220703125"},"top":{"$numberDecimal":"199"},"bottom":{"$numberDecimal":"168.20001220703125"},"left":{"$numberDecimal":"98"},"right":{"$numberDecimal":"105.5"},"x":{"$numberDecimal":"98"},"y":{"$numberDecimal":"199"}}],"clients":[{"name":"Ugonna Chiamaka Judith","email":"chiamakajudith1@gmail.com","_id":"63b0029fc0768b25e2de9fb0"},{"name":"Lilian","email":"lilianbash@yopmail.com","_id":"63b0029fc0768b25e2de9fb1"},{"name":"Chibuike","email":"ubeikejah@yopmail.com","_id":"63b0029fc0768b25e2de9fb2"},{"name":"Henry","email":"reasonerhenry@yopmail.com","_id":"63b0029fc0768b25e2de9fb3"}],"createdAt":"2022-12-31T09:36:31.914Z","updatedAt":"2022-12-31T09:36:31.914Z","__v":0}}

*/
