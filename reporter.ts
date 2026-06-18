<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Self-Healing Flow Report</title>
<style>
 body{
    margin:0;
    background:#f4f7fb;
    font-family:'Segoe UI',sans-serif;
    color:#1e293b;
    padding:30px;
}

.header{
    margin-bottom:30px;
}

.header h1{
    margin:0;
    font-size:28px;
    font-weight:700;
}

.header p{
    color:#64748b;
}

.summary{
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:20px;
    margin-bottom:30px;
}

.card{
    background:#fff;
    border-radius:12px;
    padding:20px;
    box-shadow:0 2px 12px rgba(0,0,0,.08);
}

.value{
    font-size:32px;
    font-weight:700;
}

.label{
    color:#64748b;
    margin-top:6px;
}

table{
    width:100%;
    border-collapse:collapse;
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 2px 12px rgba(0,0,0,.08);
}

th{
    background:#0f172a;
    color:#fff;
    text-align:left;
    padding:14px;
}

td{
    padding:14px;
    border-bottom:1px solid #e2e8f0;
}

tbody tr:hover{
    background:#f8fafc;
}

.tier{
    padding:6px 12px;
    border-radius:20px;
    font-size:12px;
    font-weight:600;
}

.tier.db{
    background:#dcfce7;
    color:#166534;
}

.tier.smart{
    background:#fef3c7;
    color:#92400e;
}

.tier.ai{
    background:#fee2e2;
    color:#991b1b;
}

.tier.unresolved{
    background:#e5e7eb;
    color:#374151;
}

.details{
    background:#fafafa;
}

.steps{
    width:100%;
    margin-top:10px;
}

.steps th{
    background:#334155;
    color:#fff;
    font-size:12px;
}

.steps td{
    font-size:12px;
}
</style></head><body>
<div class="header">
  <h1>Self-Healing Automation Dashboard</h1>
  <p>
    Generated 15/6/2026, 11:52:21 pm
  </p>
</div>

<div class="summary">

  <div class="card">
    <div class="value">2</div>
    <div class="label">Total Elements</div>
  </div>

  <div class="card">
    <div class="value">1</div>
    <div class="label">DB Resolved</div>
  </div>

  <div class="card">
    <div class="value">0</div>
    <div class="label">Smart Healed</div>
  </div>

  <div class="card">
    <div class="value">0</div>
    <div class="label">AI Healed</div>
  </div>

  <div class="card">
    <div class="value">1</div>
    <div class="label">Unresolved</div>
  </div>

</div>

<table>

<thead>
<tr>
<th>Element</th>
<th>Test Case</th>
<th>Final Tier</th>
<th>Healed</th>
<th>Write Back</th>
<th>Final Locator</th>
</tr>
</thead>

<tbody>

<tr>
  <td>shades_of_the_season</td>
  <td>ann-taylor page</td>

  <td>
    <span class="tier unresolved">
      UNRESOLVED
    </span>
  </td>

  <td>No</td>

  <td>No</td>

  <td>—</td>
</tr>

<tr class="details">
  <td colspan="6">

    <table class="steps">
      <thead>
        <tr>
          <th>#</th>
          <th>Tier</th>
          <th>Action</th>
          <th>Status</th>
          <th>Locator</th>
          <th>Duration</th>
        </tr>
      </thead>

      <tbody>

      
        <tr>
          <td>1</td>
          <td>db</td>
          <td>DB primary locator</td>
          <td>failed</td>
          <td>shades of the season</td>
          <td>1099</td>
        </tr>
      
        <tr>
          <td>2</td>
          <td>ai</td>
          <td>AI heal vs live DOM</td>
          <td>failed</td>
          <td>—</td>
          <td>13000</td>
        </tr>
      

      </tbody>

    </table>

  </td>
</tr>

<tr>
  <td>continue_shopping</td>
  <td>homepage interactions</td>

  <td>
    <span class="tier db">
      DB
    </span>
  </td>

  <td>No</td>

  <td>No</td>

  <td>locator('#continueButton')</td>
</tr>

<tr class="details">
  <td colspan="6">

    <table class="steps">
      <thead>
        <tr>
          <th>#</th>
          <th>Tier</th>
          <th>Action</th>
          <th>Status</th>
          <th>Locator</th>
          <th>Duration</th>
        </tr>
      </thead>

      <tbody>

      
        <tr>
          <td>1</td>
          <td>db</td>
          <td>db-primary</td>
          <td>success</td>
          <td>locator('#continueButton')</td>
          <td>-</td>
        </tr>
      

      </tbody>

    </table>

  </td>
</tr>

</tbody>

</table>
</body></html>
