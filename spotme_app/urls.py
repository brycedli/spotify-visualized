from django.urls import path

from spotme_app import views
# from hello.models import LogMessage

# home_list_view = views.HomeListView.as_view(
#     queryset=LogMessage.objects.order_by("-log_date")[:5],  # :5 limits the results to the five most recent
#     context_object_name="message_list",
#     template_name="hello/home.html",
# )

urlpatterns = [
    path("", views.visualize, name="home"),
    # path("hello/<name>", views.hello_there, name="hello_there"),
    # path("visualize/", views.visualize, name="about"),
    # path("contact/", views.contact, name="contact"),
    # path("log/", views.log_message, name="log"),
    path("spotproxy/", views.token, name = "token"),
]