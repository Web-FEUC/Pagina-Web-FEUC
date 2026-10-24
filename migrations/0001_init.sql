CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT DEFAULT '',
  org_type TEXT DEFAULT '',
  normalized_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  auto_publish INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_organizations_normalized_name ON organizations(normalized_name);

CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  organization_id TEXT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT DEFAULT '',
  company_website TEXT DEFAULT '',
  org_type TEXT DEFAULT '',
  description TEXT NOT NULL,
  responsibilities TEXT DEFAULT '',
  requirements TEXT DEFAULT '',
  type TEXT NOT NULL,
  areas_json TEXT NOT NULL DEFAULT '[]',
  careers_json TEXT NOT NULL DEFAULT '[]',
  open_to_all_careers INTEGER NOT NULL DEFAULT 0,
  experience_level TEXT DEFAULT 'estudiante',
  modality TEXT DEFAULT 'hibrido',
  location TEXT DEFAULT '',
  schedule TEXT DEFAULT 'part-time',
  compensation TEXT DEFAULT '',
  application_url TEXT NOT NULL,
  deadline TEXT DEFAULT '',
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT DEFAULT '',
  contact_verified INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  approval_method TEXT DEFAULT '',
  ai_result_json TEXT DEFAULT '',
  review_reasons_json TEXT DEFAULT '[]',
  content_hash TEXT DEFAULT '',
  submitter_ip_hash TEXT DEFAULT '',
  is_demo INTEGER NOT NULL DEFAULT 0,
  published_at TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_slug ON jobs(slug);
CREATE INDEX idx_jobs_content_hash ON jobs(content_hash);
CREATE INDEX idx_jobs_contact_email ON jobs(contact_email);

CREATE TABLE verification_tokens (
  token TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE decision_log (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  notes TEXT DEFAULT '',
  payload_json TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_decision_log_job ON decision_log(job_id);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  window_start TEXT NOT NULL
);

CREATE TABLE distribution_events (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT DEFAULT '',
  processed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_distribution_events_processed ON distribution_events(processed);

INSERT INTO settings (key, value) VALUES ('auto_publish_enabled', '0');
INSERT INTO settings (key, value) VALUES ('admin_notify_email', '');
INSERT INTO settings (key, value) VALUES ('ai_evaluations_count', '0');
