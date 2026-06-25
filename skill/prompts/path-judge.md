# Path Judge Prompt Template

Analyze this security path:

**Source:** {{source}}
- Type: {{sourceType}}
- Location: {{sourceLoc}}

**Sink:** {{sink}}
- Type: {{sinkType}}
- Category: {{category}}
- CWE: {{cwe}}

**Data Flow:**
{{dataFlow}}

**Code Context:**
```{{language}}
{{codeSnippet}}
```

Is this path exploitable? Respond with JSON following the SKILL.md format.
