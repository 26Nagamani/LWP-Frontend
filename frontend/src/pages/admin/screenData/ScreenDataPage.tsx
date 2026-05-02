import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InterpretXML from "../../../components/activity/InterpreterXml";
import { getActivityPreview } from "../../../utils/api/screenData.api";

const ScreenDataPage: React.FC = () => {
  const { topic_id: topicId } = useParams<{ topic_id: string }>();

  const [xmlString, setXmlString] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("1");

  useEffect(() => {
    if (!topicId) return;

    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getActivityPreview(topicId);
        setXmlString(response.topic_xml); // ← extract topic_xml from response
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [topicId]);

  if (loading) return (
    <div style={{ padding: 24, color: "var(--color-text-secondary)" }}>
      Loading activity...
    </div>
  );

  if (error) return (
    <div style={{ padding: 24, color: "#A32D2D" }}>
      {error}
    </div>
  );

  if (!xmlString) return null;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
      <InterpretXML
        xmlString={xmlString}
        setCurrentStep={(stepNumber) => setCurrentStep(stepNumber)}
      />
    </div>
  );
};

export default ScreenDataPage;