<%@ Application Inherits="Umbraco.Web.UmbracoApplication" Language="C#" %>

<script runat="server">
    protected void Application_Error(object sender, EventArgs e)
    {
        Exception ex = Server.GetLastError();

        Serilog.Log.Error(ex.Message);
    }
</script>