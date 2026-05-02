import { Route } from "react-router-dom";
import TopicPage from "../pages/admin/topic/TopicPage";
import ContextPage from "../pages/admin/context/ContextPage";
import StepsPage from "../pages/admin/steps/StepsPage";
import ActivityPage from "../pages/admin/activity/ActivityPage";
import ActivityPreviewPage from "../pages/admin/activityPreview/optionsActivityPreviewPage";
import InteractivePreviewPage from "../pages/admin/activityPreview/interactiveActivityPreviewPage";
import ScreenDataPage from "../pages/admin/screenData/ScreenDataPage";

export const adminRoutes = (
  <>
    <Route path="topic">
      <Route index element={<TopicPage />} />
      <Route path=":topicId" element={<TopicPage />} />
    </Route>

    <Route path="context/:topicId" element={<ContextPage />} />
    <Route path="/admin/steps/:topicId" element={<StepsPage />} />
    <Route path="/admin/activity/:topicId" element={<ActivityPage />} />
    <Route path="/admin/activity/:topicId/:stepNumber/options" element={<ActivityPreviewPage />} />
    <Route path="/admin/activity/:topicId/:stepNumber/interactive" element={<InteractivePreviewPage />} />
    <Route path="/admin/screen-data/:topic_id" element={<ScreenDataPage />} />

    <Route path="*" element={<p>404</p>} />
  </>
);