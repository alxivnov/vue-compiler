'use strict';

/** SYNC WITH DNSINTEGRATION-INTELEXTINTEGRATION WHEN UPDATED!!! */

/* eslint-disable sonarjs/no-duplicate-string, sonarjs/no-all-duplicated-branches */

const allParent = 'All';
const grcParent = 'GRC';
const allArtifactsName = 'All Artifacts';
const notableEventsArtifactsName = 'Notable Events';

const DISPLAY_PARENTS = {
	ALL: allParent,
	GRC: grcParent,
	ASST: 'Asset',
	COMM: 'Comm. & Collab.',
	LIN: 'Linux',
	WIN: 'Windows',
	WIN_ASST: 'Windows Asset',
	MAC: 'macOS',
	CLOUD: 'Cloud Configuration Man.',
	OSQRY: 'OSQuery (Common)',
	INTEG: 'Platform Integrations',
	HARDEN: 'Hardening & Conf. Man.',
	EXPOS: 'Exposure & Discovery',
	SIGMA: 'SIGMA & YARA',
	THREAT: 'Threat Analytics',
	VULN: 'Vulnerability Management'
};

const artifactsMapFn = (artifactsMapCommonFn, artifactsMapLinuxFn, artifactsMapMacFn, artifactsMapWindowsFn) => ({
	'all-artifacts': {
		displayParent: DISPLAY_PARENTS.ALL,
		label: allArtifactsName,
		noKpi: true,
		deviceGuidColumn: null,
		entryGuidColumn: null,
		noMitreColumns: true,
		lastUpdateColumn: null
	},
	...Object.fromEntries(Object.entries(artifactsMapCommonFn(DISPLAY_PARENTS))
		.map(e => [ e[0], { ...e[1], entryGuidColumn: undefined, noMitreColumns: false, deviceGuidColumn: 'asset_guid' } ])),
	...Object.fromEntries(Object.entries(artifactsMapLinuxFn(DISPLAY_PARENTS))
		.map(e => [ e[0], { ...e[1], entryGuidColumn: undefined, noMitreColumns: false, deviceGuidColumn: 'asset_guid' } ])),
	...Object.fromEntries(Object.entries(artifactsMapMacFn(DISPLAY_PARENTS))
		.map(e => [ e[0], { ...e[1], entryGuidColumn: undefined, noMitreColumns: false, deviceGuidColumn: 'asset_guid' } ])),
	// ...artifactsMapWindowsFn(DISPLAY_PARENTS),
	'service-desk-alerts': {
		displayParent: DISPLAY_PARENTS.ALL,
		label: 'Notable Events',
		table: 'service_desk_alerts',
		uiPath: '/#/threat_hunting/notable_events/service_desk_alerts',
		entryGuidColumn: null,
		noMitreColumns: true,
		lastUpdateColumn: 'creation_time',
		dontSetClassificationCols: true
	},
	'intel-vulnerabilities': {
		onlyAsRel: true,
		commonTable: true,
		displayParent: DISPLAY_PARENTS.VULN,
		displayLabel: 'NIST NVD Vulnerabilities',
		parent: 'Forensics Enrichment',
		label: 'Vulnerabilities',
		table: 'intel_forensics_enrichment_vulnerabilities',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'intel-active-vulnerabilities': {
		onlyAsRel: true,
		commonTable: true,
		displayParent: DISPLAY_PARENTS.VULN,
		displayLabel: 'CISA KEV & Zero-Day Initiative Vulnerabilities',
		parent: 'Forensics Enrichment',
		label: 'CISA KEV & Zero-Day Initiative Vulnerabilities',
		table: 'intel_forensics_enrichment_vulnerabilities_active',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'security-controls': {
		commonTable: true,
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.ALL,
		label: 'Security Controls',
		table: 'security_control_controls',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'grc-risk-registry-templates': {
		commonTable: true,
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Risk Registry Template',
		table: 'grc_risk_registry_templates',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'grc-risk-registry-templates-org': {
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Risk Registry Template (Org)',
		table: 'grc_risk_registry_templates',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'grc-evidences-super': {
		commonTable: true,
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Evidence (Super)',
		table: 'grc_evidences',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'grc-evidences': {
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Evidence',
		table: 'grc_evidences',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'grc-documents-templates': {
		commonTable: true,
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Document Template',
		table: 'grc_documents_templates',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'grc-documents-templates-org': {
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Document Template (Org)',
		table: 'grc_documents_templates',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'grc-risk-registry': {
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Risk Registry',
		table: 'grc_risk_registry',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'grc-documents': {
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Document',
		table: 'grc_documents',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null,
		noMitreColumns: true,
		noRiskColumns: true
	},
	'grc-assessment-activities': {
		pseudoArtifact: true,
		grcOnly: true,
		displayParent: DISPLAY_PARENTS.GRC,
		label: 'GRC Assessment Activity',
		table: 'grc_assessment_activities',
		lastUpdateColumn: '_modified',
		deviceGuidColumn: null
	},
	'windows-autoruns': {
		displayParent: DISPLAY_PARENTS.WIN,
		label: 'Windows Autoruns',
		table: 'forensics_artifacts_windows_autoruns_deep',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_artifacts_windows_autoruns_deep',
		deviceGuidColumn: 'device_id'
	},
	'windows-processes': {
		displayParent: DISPLAY_PARENTS.WIN,
		label: 'Windows Processes',
		table: 'forensics_artifacts_windows_processes',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_artifacts_windows_processes',
		deviceGuidColumn: 'device_id'
	},
	'windows-inventory-ports': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		displayLabel: 'Windows Listening Port Analysis',
		parent: 'Windows Inventory',
		label: 'Application Listening Ports',
		table: 'agent_data_tcpports',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_asset/agent_data_tcpports',
		deviceGuidColumn: 'device_guid'
	},
	'windows-inventory-apps': {
		displayParent: DISPLAY_PARENTS.VULN,
		displayLabel: 'Windows Application Analysis',
		parent: 'Windows Inventory',
		label: 'Applications',
		table: 'agent_data_applications',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_asset/agent_data_applications',
		deviceGuidColumn: 'device_guid'
	},
	'windows-inventory-netadapters': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		displayLabel: 'Windows Network Adapter Analysis',
		parent: 'Windows Inventory',
		label: 'Network Adapters',
		table: 'agent_data_network_adapters',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_asset/agent_data_network_adapters',
		deviceGuidColumn: 'device_guid'
	},
	'windows-inventory-netadapter-activity': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		displayLabel: 'Windows Network Adapter Activity',
		parent: 'Windows Asset',
		label: 'Windows Network Adaptor Activity',
		table: 'logs_windows_netadaptor_activity',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_asset/logs_windows_netadaptor_activity',
		deviceGuidColumn: 'device_guid'
	},
	'windows-inventory-netshares': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		displayLabel: 'Windows Share Analysis',
		parent: 'Windows Inventory',
		label: 'Network Shares',
		table: 'agent_data_network_shares',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_asset/agent_data_network_shares',
		deviceGuidColumn: 'device_guid'
	},
	'windows-inventory-os': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		displayLabel: 'Windows Computer Analysis',
		parent: 'Windows Inventory',
		label: 'Computer Analysis',
		table: 'agent_data_os_information',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_asset/agent_data_os_information',
		deviceGuidColumn: 'device_guid'
	},
	'device-management': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'Network Discovered Devices',
		label: 'Device Management',
		table: 'asset_main_devices',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_main_devices',
		entryGuidColumn: 'device_guid',
		deviceGuidColumn: 'device_guid'
	},
	'repository-user-management': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'Repository Discovered Users',
		parent: 'Asset Management',
		label: 'Repository User Management',
		table: 'asset_repository_users',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_repository_users',
		entryGuidColumn: 'uuid',
		deviceGuidColumn: null
	},
	'repository-group-management': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'Repository Discovered Groups',
		parent: 'Asset Management',
		label: 'Repository Group Management',
		table: 'asset_repository_groups',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_repository_groups',
		entryGuidColumn: 'uuid',
		deviceGuidColumn: null
	},
	'repository-group-membership-management': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'Repository Discovered Group Members',
		parent: 'Asset Management',
		label: 'Repository Group Membership Management',
		table: 'asset_repository_users_groups',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_repository_users_groups',
		entryGuidColumn: null,
		deviceGuidColumn: null
	},
	'repository-device-management': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'Repository Devices',
		parent: 'Asset Management',
		label: 'Repository Device Management',
		table: 'asset_repository_devices',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_repository_devices',
		entryGuidColumn: 'uuid',
		deviceGuidColumn: 'asset_main_device_id'
	},
	'repository-roles': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'Repository Discovered Roles',
		parent: 'Asset Management',
		label: 'Repository Discovered Roles',
		table: 'asset_repository_roles',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_repository_roles',
		entryGuidColumn: null,
		deviceGuidColumn: null
	},
	'repository-users-roles': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'Repository Discovered Role Members',
		parent: 'Asset Management',
		label: 'Repository Discovered Role Members',
		table: 'asset_repository_users_roles',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_repository_users_roles',
		entryGuidColumn: null,
		deviceGuidColumn: null
	},
	'windows-file-macro-analysis': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows File Macro Analysis',
		table: 'forensics_artifacts_files_user',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_artifacts_files_user',
		deviceGuidColumn: 'device_guid'
	},
	'windows-security-bench-sce-results': {
		displayParent: DISPLAY_PARENTS.HARDEN,
		displayLabel: 'Windows Hardening',
		parent: 'Windows Artifacts',
		label: 'Windows Security Benchmark Scenarios',
		table: 'scenario_windows_security_control_results',
		uiPath: '/#/security_assurance/hardening_and_conf_management/scenario_windows_security_control_results'
	},
	'security-control-results': {
		displayParent: DISPLAY_PARENTS.HARDEN,
		displayLabel: 'Security Control Results',
		label: 'Security Control Results',
		table: 'security_control_results',
		uiPath: '/#/security_assurance/hardening_and_conf_management/security_control_results'
	},
	'windows-file-analysis': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows File Analysis',
		table: 'forensics_windows_files',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_files',
		deviceGuidColumn: null
	},
	'windows-thor-analysis': {
		displayParent: DISPLAY_PARENTS.SIGMA,
		displayLabel: 'Windows YARA/Thor Analysis',
		parent: 'Pattern Analysis Artifacts',
		label: 'Windows Thor Analysis',
		table: 'forensics_windows_thor_results',
		uiPath: '/#/threat_hunting/analysis_and_investigation/sigma_yara/forensics_windows_thor_results',
		deviceGuidColumn: 'asset_guid',
		noMitreColumns: true
	},
	'email-management': {
		displayParent: DISPLAY_PARENTS.COMM,
		displayLabel: 'E-Mails Reported',
		label: 'E-mail Management',
		table: 'phishing_reports',
		uiPath: '/#/threat_hunting/analysis_and_investigation/comm_and_collab/phishing_reports',
		entryGuidColumn: null,
		deviceGuidColumn: null
	},
	'windows-eventlog-security': {
		displayParent: DISPLAY_PARENTS.WIN,
		displayLabel: 'Windows Event Log Analysis',
		parent: 'Windows Event Log',
		label: 'Security',
		table: 'logs_winlog_security',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/logs_winlog_security',
		deviceGuidColumn: 'device_guid'
	},
	'windows-eventlog-sysmon': {
		displayParent: DISPLAY_PARENTS.WIN,
		displayLabel: 'Windows Sysmon Analysis',
		parent: 'Windows Event Log',
		label: 'Sysmon',
		table: 'logs_winlog_sysmon',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/logs_winlog_sysmon',
		deviceGuidColumn: 'device_guid'
	},
	'linux-processes': {
		displayParent: DISPLAY_PARENTS.LIN,
		parent: 'Linux Analysis',
		label: 'Linux Processes',
		table: 'forensics_linux_processes',
		uiPath: '/#/threat_hunting/analysis_and_investigation/linux_artifacts/forensics_linux_processes',
		deviceGuidColumn: 'asset_main_device_guid',
		noMitreColumns: true
	},
	'linux-users': {
		displayParent: DISPLAY_PARENTS.LIN,
		parent: 'Linux Analysis',
		label: 'Linux Users',
		table: 'forensics_linux_users',
		uiPath: '/#/threat_hunting/analysis_and_investigation/linux_artifacts/forensics_linux_users',
		deviceGuidColumn: 'asset_main_device_guid',
		noMitreColumns: true
	},
	'linux-crontabs': {
		displayParent: DISPLAY_PARENTS.LIN,
		parent: 'Linux Analysis',
		label: 'Linux Crontabs',
		table: 'forensics_linux_crontab',
		uiPath: '/#/threat_hunting/analysis_and_investigation/linux_artifacts/forensics_linux_crontab',
		deviceGuidColumn: 'asset_main_device_guid',
		noMitreColumns: true
	},
	'linux-command-history': {
		displayParent: DISPLAY_PARENTS.LIN,
		parent: 'Linux Analysis',
		label: 'Linux Command History',
		table: 'forensics_linux_command_history',
		uiPath: '/#/threat_hunting/analysis_and_investigation/linux_artifacts/forensics_linux_command_history',
		deviceGuidColumn: 'asset_main_device_guid',
		noMitreColumns: true
	},
	'linux-authentication-logs': {
		displayParent: DISPLAY_PARENTS.LIN,
		parent: 'Linux Analysis',
		label: 'Linux Authentication Logs',
		table: 'logs_linux_auth',
		uiPath: '/#/threat_hunting/analysis_and_investigation/linux_artifacts/logs_linux_auth',
		deviceGuidColumn: 'asset_main_device_guid',
		noMitreColumns: true
	},
	'linux-syslog-messages': {
		displayParent: DISPLAY_PARENTS.LIN,
		parent: 'Linux Analysis',
		label: 'Linux Syslog Messages',
		table: 'logs_linux_syslog',
		uiPath: '/#/threat_hunting/analysis_and_investigation/linux_artifacts/logs_linux_syslog',
		deviceGuidColumn: 'asset_main_device_guid',
		noMitreColumns: true
	},
	'osquery-deb-packages': {
		displayParent: DISPLAY_PARENTS.LIN,
		label: 'OSQuery DEB Packages',
		table: 'forensics_osquery_data_deb_packages',
		uiPath: '/#/threat_hunting/analysis_and_investigation/linux_artifacts/forensics_osquery_data_deb_packages',
		deviceGuidColumn: 'asset_guid'
	},
	'feed-marketscape-data-dumps': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'EAASM MScape Darkweb Analysis',
		parent: 'Asset Management',
		label: 'MScape Darkweb',
		table: 'feed_marketscape_data_dumps',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/feed_marketscape_data_dumps',
		entryGuidColumn: null,
		deviceGuidColumn: null
	},
	'feed-marketscape-data-breaches': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'EAASM MScape Breach Analysis',
		parent: 'Asset Management',
		label: 'MScape Breach Analysis',
		table: 'feed_marketscape_data_breaches',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/feed_marketscape_data_breaches',
		deviceGuidColumn: null
	},
	'feed-marketscape-whois-data': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'EAASM MScape Domain Analysis',
		parent: 'Asset Management',
		label: 'MScape Domains',
		table: 'feed_marketscape_whois_data',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/feed_marketscape_whois_data',
		deviceGuidColumn: null
	},
	'feed-riskxchange-cybersquatting': {
		displayParent: DISPLAY_PARENTS.ASST,
		parent: 'EAASM Artifacts',
		label: 'RiskXchange Domain Analysis',
		table: 'feed_riskxchange_cybersquatting',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/feed_riskxchange_cybersquatting',
		entryGuidColumn: null,
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'feed-riskxchange-issues': {
		displayParent: DISPLAY_PARENTS.ASST,
		parent: 'EAASM Artifacts',
		label: 'RiskXchange Detected Issues',
		table: 'feed_riskxchange_issues',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/feed_riskxchange_issues',
		entryGuidColumn: null,
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'feed-riskxchange-leaked-credentials': {
		displayParent: DISPLAY_PARENTS.ASST,
		parent: 'EAASM Artifacts',
		label: 'RiskXchange Leaked Credentials',
		table: 'feed_riskxchange_leakedcredentials',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/feed_riskxchange_leakedcredentials',
		entryGuidColumn: null,
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'forensics-threat-detection-results': {
		displayParent: DISPLAY_PARENTS.SIGMA,
		displayLabel: 'SIGMA Analysis',
		parent: 'Forensics',
		label: 'Threat Detection Results',
		table: 'forensics_threat_detection_results',
		uiPath: '/#/threat_hunting/analysis_and_investigation/sigma_yara/forensics_threat_detection_results',
		entryGuidColumn: null,
		deviceGuidColumn: 'asset_main_device_guid',
		noMitreColumns: false,
		dontSetClassificationCols: true
	},
	'forensics-threat-monitoring-events': {
		displayParent: DISPLAY_PARENTS.THREAT,
		displayLabel: 'Windows Sysmon Threat Analysis',
		label: 'Windows Threat Monitoring Events',
		table: 'forensics_windows_threat_monitoring_events',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_windows_threat_monitoring_events'
	},
	'forensics-threat-monitoring-scripts': {
		displayParent: DISPLAY_PARENTS.THREAT,
		displayLabel: 'Windows Sysmon Threat Monitoring Scripts Analysis',
		label: 'Windows Threat Monitoring Scripts',
		table: 'forensics_windows_threat_monitoring_scripts',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_windows_threat_monitoring_scripts'
	},
	'windows-object-and-honeypot-access-events': {
		displayParent: DISPLAY_PARENTS.THREAT,
		displayLabel: 'Windows Object and Honeypot Access Events',
		label: 'Windows Object and Honeypot Access Events',
		table: 'forensics_windows_object_and_honeypot_access_events',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_windows_object_and_honeypot_access_events'
	},
	'winlog-security-rdp-login-activity': {
		displayParent: DISPLAY_PARENTS.THREAT,
		displayLabel: 'Windows RDP Login Activity',
		label: 'Windows RDP Login Activity',
		table: 'logs_winlog_security_rdp_login_activity',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/logs_winlog_security_rdp_login_activity',
		deviceGuidColumn: 'device_guid'
	},
	'winlog-security-failed-logins': {
		displayParent: DISPLAY_PARENTS.THREAT,
		displayLabel: 'Windows Failed Login Analysis',
		label: 'Windows Failed Login Analysis',
		table: 'logs_winlog_security_failed_logins',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/logs_winlog_security_failed_logins',
		deviceGuidColumn: 'device_guid'
	},
	'windows-dll-analysis': {
		displayParent: DISPLAY_PARENTS.THREAT,
		label: 'Windows DLL Analysis',
		table: 'forensics_windows_dll_analysis',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_windows_dll_analysis',
		deviceGuidColumn: 'asset_guid'
	},
	'windows-vulnerability-pipaudit': {
		displayParent: DISPLAY_PARENTS.VULN,
		label: 'Windows Vulnerability PipAudit',
		table: 'forensics_windows_vulnerability_pipaudit',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_windows_vulnerability_pipaudit',
		deviceGuidColumn: 'asset_guid'
	},
	'windows-vulnerability-bandit': {
		displayParent: DISPLAY_PARENTS.VULN,
		label: 'Windows Vulnerability Bandit',
		table: 'forensics_windows_vulnerability_bandit',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_windows_vulnerability_bandit',
		deviceGuidColumn: 'asset_guid'
	},
	'windows-vulnerability-trivy': {
		displayParent: DISPLAY_PARENTS.VULN,
		label: 'Windows Vulnerability Trivy',
		table: 'forensics_windows_vulnerability_trivy',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_windows_vulnerability_trivy',
		deviceGuidColumn: 'asset_guid'
	},
	'monitoring-windows-machine-utilization': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		displayLabel: 'Windows Endpoint Performance Utilization',
		label: 'Windows Endpoint Utilization Summary',
		table: 'monitoring_windows_machine_utilization',
		uiPath: '/#/asset_management/performance_management/monitoring_windows_machine_utilization',
		deviceGuidColumn: 'asset_guid'
	},
	'monitoring-windows-process-utilization': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		displayLabel: 'Windows Process Performance Utilization',
		label: 'Windows Process Utilization Summary',
		table: 'monitoring_windows_process_utilization',
		uiPath: '/#/asset_management/performance_management/monitoring_windows_process_utilization',
		deviceGuidColumn: 'asset_guid'
	},
	'windows-file-activity-analysis': {
		displayParent: DISPLAY_PARENTS.THREAT,
		displayLabel: 'Windows File Activity Analysis',
		label: 'Windows File Activity Analysis',
		table: 'forensics_windows_file_activity_events',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_windows_file_activity_events'
	},
	'windows-hotfixes': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Hotfixes',
		table: 'forensics_windows_hotfixes',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_hotfixes',
		noMitreColumns: true
	},
	'asset-windows-os-patch-management-missing': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows OS Missing Patch Management',
		table: 'asset_windows_os_patch_management_missing'
		// uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_hotfixes'
	},
	'asset-windows-os-patch-management-history': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows OS Patch Management History',
		table: 'asset_windows_os_patch_management_history'
		// uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_hotfixes'
	},
	'asset-windows-os-patch-management': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows OS Patch Management',
		table: 'asset_windows_os_patch_management'
		// uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_hotfixes'
	},
	'windows-shimcache': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Shimcache',
		table: 'forensics_windows_shimcache',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_shimcache',
		noMitreColumns: true
	},
	'windows-amcache-device-containers': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Amcache Device Containers',
		table: 'forensics_windows_amcache_device_containers',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_amcache_device_containers',
		noMitreColumns: true
	},
	'windows-amcache-device-pnps': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Amcache Device PnPs',
		table: 'forensics_windows_amcache_device_pnps',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_amcache_device_pnps',
		noMitreColumns: true
	},
	'windows-amcache-drive-binaries': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Amcache Drive Binaries',
		table: 'forensics_windows_amcache_drive_binaries',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_amcache_drive_binaries',
		noMitreColumns: true
	},
	'windows-amcache-driver-packages': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Amcache Driver Packages',
		table: 'forensics_windows_amcache_driver_packages',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_amcache_driver_packages',
		noMitreColumns: true
	},
	'windows-amcache-shortcuts': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Amcache Shortcuts',
		table: 'forensics_windows_amcache_shortcuts',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_amcache_shortcuts',
		noMitreColumns: true
	},
	'windows-amcache-unassociated-file-entries': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Amcache Unassociated File Entries',
		table: 'forensics_windows_amcache_unassociated_file_entries',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_amcache_unassociated_file_entries',
		noMitreColumns: true
	},
	'windows-arp-cache': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows ARP Cache',
		table: 'forensics_windows_arpcache',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_arpcache',
		noMitreColumns: true
	},
	'windows-dns-cache': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows DNS Cache',
		table: 'forensics_windows_dnscache',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_arpcache',
		noMitreColumns: true
	},
	'windows-smbsession': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows SMB Session',
		table: 'forensics_windows_smbsession',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_smbsession',
		noMitreColumns: true
	},
	'windows-prefetch-files': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Prefetch Files Listing',
		table: 'forensics_windows_prefetch_files',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_prefetch_files',
		noMitreColumns: true
	},
	'windows-local-users': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Local Users',
		table: 'forensics_windows_local_users',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_local_users',
		noMitreColumns: true
	},
	'windows-local-admin': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Local Administrators',
		table: 'forensics_windows_local_admin',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_local_admin',
		noMitreColumns: true
	},
	'windows-pnp-devices': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows PnP Devices',
		table: 'forensics_windows_pnpdevices',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_pnpdevices',
		noMitreColumns: true
	},
	'windows-office-mru': {
		displayParent: DISPLAY_PARENTS.WIN,
		parent: 'Windows Artifacts',
		label: 'Windows Office MRU',
		table: 'forensics_windows_office_mru',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_office_mru',
		noMitreColumns: true
	},
	'windows-update-analysis': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		label: 'Windows Update Analysis',
		table: 'forensics_windows_update_status',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_asset/forensics_windows_update_status',
		noMitreColumns: false
	},
	'windows-asset-activity-tracking': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		label: 'Windows Asset Activity Tracking',
		table: 'asset_tracking_events',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/asset_tracking_events',
		entryGuidColumn: null,
		lastUpdateColumn: 'creation_time',
		noMitreColumns: false
	},
	'windows-hardware-summary': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		label: 'Windows Hardware Summary',
		table: 'asset_hardware_summary',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/asset_hardware_summary',
		noMitreColumns: false
	},
	'windows-disk-drive-analysis': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		label: 'Windows Disk Drive Analysis',
		table: 'asset_hardware_disk_drives',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/asset_hardware_disk_drives',
		noMitreColumns: false
	},
	'windows-system-drivers': {
		displayParent: DISPLAY_PARENTS.WIN,
		label: 'Windows System Drivers',
		table: 'asset_software_system_drivers',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/asset_software_system_drivers',
		noMitreColumns: false
	},
	'windows-usb-devices': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		label: 'Windows USB Devices',
		table: 'asset_hardware_usb_devices',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/asset_hardware_usb_devices',
		noMitreColumns: false
	},
	'windows-browser-domain-analysis': {
		displayParent: DISPLAY_PARENTS.WIN,
		label: 'Windows Browser Domain Analysis',
		table: 'forensics_browser_history_domain',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_browser_history_domain',
		noMitreColumns: false
	},
	'windows-browser-url-analysis': {
		displayParent: DISPLAY_PARENTS.WIN,
		label: 'Windows Browser URL Analysis',
		table: 'forensics_browser_history_url',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_browser_history_url',
		noMitreColumns: false
	},
	'windows-browser-add-on-analysis': {
		displayParent: DISPLAY_PARENTS.WIN,
		label: 'Windows Browser Add-On Analysis',
		table: 'forensics_windows_browser_addons',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_browser_addons',
		noMitreColumns: false
	},
	'network-certificate-analysis': {
		displayParent: DISPLAY_PARENTS.ASST,
		parent: 'Network Analysis Artifacts',
		label: 'SSL Certificate Analysis',
		table: 'forensics_network_certificate_analysis',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/forensics_network_certificate_analysis',
		entryGuidColumn: null,
		noMitreColumns: true
	},
	'forensics_windows_appfile_analysis': {
		displayParent: DISPLAY_PARENTS.VULN,
		parent: 'Windows Artifacts',
		label: 'IIS Filter and Handler Analysis',
		table: 'forensics_windows_appfile_analysis',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_artifacts/forensics_windows_appfile_analysis',
		deviceGuidColumn: 'device_guid',
		noMitreColumns: false
	},
	'scenario-dlp-analysis': {
		displayParent: DISPLAY_PARENTS.HARDEN,
		label: 'DLP Analysis',
		table: 'scenario_dlp_analysis',
		uiPath: '/#/security_assurance/hardening_and_conf_management/scenario_dlp_analysis',
		noMitreColumns: false
	},
	'scenario-edr-analysis': {
		displayParent: DISPLAY_PARENTS.HARDEN,
		label: 'EDR Analysis',
		table: 'scenario_edr_analysis',
		uiPath: '/#/security_assurance/hardening_and_conf_management/scenario_edr_analysis',
		noMitreColumns: false
	},
	'logs-security-software-endpoint-events': {
		displayParent: DISPLAY_PARENTS.THREAT,
		label: 'Endpoint Security Software Activity',
		table: 'logs_security_software_endpoint_events',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/logs_security_software_endpoint_events',
		deviceGuidColumn: 'asset_guid',
		entryGuidColumn: null
	},
	'linux-macos-security-software-summary': {
		displayParent: DISPLAY_PARENTS.ASST,
		displayLabel: 'Linux/macOS Security Software Summary',
		label: 'Linux macOS Security Software Summary',
		table: 'asset_linux_macos_security_software_summary',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_linux_macos_security_software_summary',
		deviceGuidColumn: 'device_guid'
	},
	'asset-windows-security-center-summary': {
		displayParent: DISPLAY_PARENTS.ASST,
		label: 'Windows Security Center Summary',
		table: 'asset_windows_security_center_summary',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_windows_security_center_summary',
		deviceGuidColumn: 'asset_guid'
	},
	'logs-winlog-powershell': {
		displayParent: DISPLAY_PARENTS.THREAT,
		label: 'Windows PowerShell Log Analysis',
		table: 'logs_winlog_powershell',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/logs_winlog_powershell',
		deviceGuidColumn: 'asset_guid'
	},
	'microsoft-defender-health-analysis': {
		displayParent: DISPLAY_PARENTS.ASST,
		label: 'Microsoft Defender Health Analysis',
		table: 'asset_data_microsoft_defender',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_data_microsoft_defender',
		deviceGuidColumn: 'asset_guid'
	},
	'microsoft-defender-mde-analysis': {
		displayParent: DISPLAY_PARENTS.ASST,
		label: 'Microsoft Defender MDE Analysis',
		table: 'asset_data_microsoft_defender_mde_results',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_data_microsoft_defender_mde_results',
		deviceGuidColumn: 'asset_guid'
	},
	'crowdstrike-analysis': {
		displayParent: DISPLAY_PARENTS.ASST,
		label: 'CrowdStrike Analysis',
		table: 'asset_data_crowdstrike',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_data_crowdstrike',
		deviceGuidColumn: 'asset_guid'
	},
	'paloalto-cortex-xdr-analysis': {
		displayParent: DISPLAY_PARENTS.ASST,
		label: 'Palo Alto Cortex CDR Analysis',
		table: 'asset_data_paloalto_cortex_xdr',
		uiPath: '/#/threat_hunting/analysis_and_investigation/assets/asset_data_paloalto_cortex_xdr',
		deviceGuidColumn: 'asset_guid'
	},
	'paloalto-cortex-xdr-alerts': {
		displayParent: DISPLAY_PARENTS.THREAT,
		label: 'Palo Alto Cortex XDR Alerts',
		table: 'logs_paloalto_cortex_xdr_alerts',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/palo_alto_cortex_xdr_alerts',
		deviceGuidColumn: 'asset_main_device_guid'
	},
	'palo-alto-cortex-xdr-incidents': {
		displayParent: DISPLAY_PARENTS.THREAT,
		label: 'Palo Alto Cortex XDR Incidents',
		table: 'logs_paloalto_cortex_xdr_incidents',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/palo_alto_cortex_xdr_incidents',
		deviceGuidColumn: 'asset_main_device_guid'
	},
	'microsoft-defender-security-center-events': {
		displayParent: DISPLAY_PARENTS.INTEG,
		label: 'Microsoft Defender Security Center Events',
		table: 'logs_microsoft_defender_security_center_events',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/ms_defender_security_center_events',
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'phishing-gophish-campaigns': {
		displayParent: DISPLAY_PARENTS.INTEG,
		label: 'GoPhish Campaigns',
		table: 'simulation_phishing_gophish_campaigns',
		uiPath: '/#/security_assurance/human_risk_management/simulation_phishing_gophish_campaigns',
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'phishing-gophish-campaign-results': {
		displayParent: DISPLAY_PARENTS.INTEG,
		label: 'GoPhish Campaign Results',
		table: 'simulation_phishing_gophish_campaign_results',
		uiPath: '/#/security_assurance/human_risk_management/simulation_phishing_gophish_campaign_results',
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'learning-survey-completions': {
		displayParent: DISPLAY_PARENTS.INTEG,
		label: 'Survey Results',
		table: 'learning_survey_completions',
		uiPath: '/#/security_assurance/human_risk_management/learning_survey_completions',
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'learning-course-completions': {
		displayParent: DISPLAY_PARENTS.INTEG,
		label: 'Course Results',
		table: 'learning_course_completions',
		uiPath: '/#/security_assurance/human_risk_management/learning_course_completions',
		deviceGuidColumn: null,
		noMitreColumns: true
	},
	'crowdstrike-events': {
		displayParent: DISPLAY_PARENTS.INTEG,
		label: 'CrowdStrike Events',
		table: 'logs_crowdstrike_events',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/crowdstrike_events',
		deviceGuidColumn: null,
		noMitreColumns: false
	},
	'external-exposure-domain-information': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		label: 'External Domain Analysis',
		table: 'external_exposure_domain_information',
		uiPath: '/#/threat_hunting/analysis_and_investigation/external_exposure_analysis/external_exposure_domain_information',
		noMitreColumns: true,
		// entryGuidColumn: null,
		deviceGuidColumn: null
	},
	'external-exposure-asset-information': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		label: 'External Asset Analysis',
		table: 'external_exposure_asset_information',
		uiPath: '/#/threat_hunting/analysis_and_investigation/external_exposure_analysis/external_exposure_asset_information',
		noMitreColumns: true,
		// entryGuidColumn: null,
		deviceGuidColumn: null
	},
	'external-exposure-certificate-analysis': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		label: 'External SSL Certificate Analysis',
		table: 'external_exposure_certificate_analysis',
		uiPath: '/#/threat_hunting/analysis_and_investigation/external_exposure_analysis/external_exposure_certificate_analysis',
		noMitreColumns: true
		// entryGuidColumn: null,
		// deviceGuidColumn: null
	},
	'external-exposure-vulnerability-scan-results': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		label: 'External Vulnerability Scan Analysis',
		table: 'external_exposure_vulnerability_scan_results',
		uiPath: '/#/threat_hunting/analysis_and_investigation/external_exposure_analysis/external_exposure_vulnerability_scan_results',
		noMitreColumns: true
	},
	'external-exposure-nmap-script-scan-results': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		displayLabel: 'External NMAP Scan Analysis',
		label: 'External Nmap Scan Analysis',
		table: 'external_exposure_nmap_script_scan_results',
		uiPath: '/#/threat_hunting/analysis_and_investigation/external_exposure_analysis/external_exposure_nmap_script_scan_results',
		noMitreColumns: true,
		entryGuidColumn: null
		// deviceGuidColumn: 'asset_guid'
	},
	'external-exposure-cybersquatting': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		label: 'External Exposure Cybersquatting',
		table: 'external_exposure_cybersquatting',
		// uiPath: '/#/threat_hunting/analysis_and_investigation/external_assets/external_exposure_cybersquatting',
		noMitreColumns: false,
		deviceGuidColumn: null
	},
	'external-exposure-darkweb': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		label: 'External Exposure Darkweb',
		table: 'external_exposure_darkweb',
		// uiPath: '/#/threat_hunting/analysis_and_investigation/external_assets/external_exposure_darkweb',
		noMitreColumns: false,
		deviceGuidColumn: null
	},
	'external-exposure-data-breaches': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		label: 'External Exposure Data Breaches',
		table: 'external_exposure_data_breaches',
		// uiPath: '/#/threat_hunting/analysis_and_investigation/external_assets/external_exposure_data_breaches',
		noMitreColumns: false,
		deviceGuidColumn: null
	},
	'external-exposure-leaked-credentials': {
		displayParent: DISPLAY_PARENTS.EXPOS,
		label: 'External Exposure Leaked Credentials',
		table: 'external_exposure_leaked_credentials',
		// uiPath: '/#/threat_hunting/analysis_and_investigation/external_assets/external_exposure_leaked_credentials',
		noMitreColumns: false,
		deviceGuidColumn: null
	},
	'vulnerability-scan-results': {
		displayParent: DISPLAY_PARENTS.VULN,
		parent: 'Vulnerability Management',
		label: 'Vulnerability Scan Results',
		table: 'vulnerability_scan_results',
		uiPath: '/#/security_assurance/vulnerability_management/vulnerability_scan_results',
		noMitreColumns: false
	},
	'nmap-script-scan-results': {
		displayParent: DISPLAY_PARENTS.THREAT,
		displayLabel: 'NMAP Script Scan Results',
		parent: DISPLAY_PARENTS.THREAT,
		label: 'Nmap Script Scan Results',
		table: 'forensics_network_nmap_script_scan_results',
		uiPath: '/#/threat_hunting/analysis_and_investigation/threat_analytics/forensics_network_nmap_script_scan_results',
		noMitreColumns: false
	},
	'asset-analysis-summary': {
		displayParent: DISPLAY_PARENTS.ASST,
		parent: 'Asset',
		label: 'Asset Health and Threat Summary',
		table: 'asset_health_threat_summary',
		entryGuidColumn: null
	},
	'forensics-windows-login-activity-tracking-events': {
		displayParent: DISPLAY_PARENTS.WIN_ASST,
		label: 'Windows Login Activity Tracking',
		table: 'forensics_windows_login_activity_tracking_events',
		uiPath: '/#/threat_hunting/analysis_and_investigation/windows_asset/forensics_windows_login_activity_tracking_events',
		lastUpdateColumn: 'creation_time',
		noMitreColumns: false
	},
	'cloud-audit-prowler': {
		displayParent: DISPLAY_PARENTS.CLOUD,
		label: 'Cloud Audit Prowler Results',
		table: 'security_controls_prowler_results',
		uiPath: '/#/security_assurance/cloud_configuration_management/security_controls_prowler_results',
		noMitreColumns: false,
		deviceGuidColumn: null
	},
	'wazuh-security-control-results': {
		displayParent: DISPLAY_PARENTS.HARDEN,
		label: 'Wazuh Security Control Results',
		table: 'security_controls_wazuh_results',
		uiPath: '/#/security_assurance/hardening_and_conf_management/security_controls_wazuh_results'
	}
});

module.exports = function (artifactsMapCommonFn, artifactsMapLinuxFn, artifactsMapMacFn, artifactsMapWindowsFn) {
	const artifactsMap = artifactsMapFn(artifactsMapCommonFn, artifactsMapLinuxFn, artifactsMapMacFn, artifactsMapWindowsFn);

	const artifacts = Object.fromEntries(Object.entries(artifactsMap).map(c => {
		c[1].viewAvailable = !!c[1].uiPath;
		c[1].deviceGuidAvailable = !!c[1].deviceGuidColumn;

		c[1].artifactType = c[1].fullLabel = c[1].parent ? `${ c[1].parent } ${ c[1].label }` : c[1].label;
		// set asset_guid as defaults (for all undefined)
		if (c[1].deviceGuidColumn !== null && !c[1].deviceGuidColumn) c[1].deviceGuidColumn = 'asset_guid';
		// set entry_guid as defaults (for all undefined)
		if (c[1].entryGuidColumn !== null && !c[1].entryGuidColumn) c[1].entryGuidColumn = 'entry_guid';

		c[1].displayParent = c[1].displayParent || c[1].parent;
		c[1].displayLabel = c[1].displayLabel || c[1].label;
		return [ c[1].fullLabel, c[1] ];
	}));

	return {
		artifactsMap,
		artifacts,
		allParent,
		allArtifactsName,
		notableEventsArtifactsName
	};
}
